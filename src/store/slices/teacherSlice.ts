import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TeacherService, TeacherProfile, TeacherQualification } from '@/app/dashboard/teacher/services';

export interface TeacherEligibility {
  is_eligible_to_apply: boolean;
  is_eligible_to_teach: boolean;
  qualifications_count: number;
  qualified_subjects: number;
  has_teacher_profile: boolean;
  teacher_status?: string;
  profile_created_at?: string;
  approved_at?: string;
  qualifications_by_subject: Record<string, TeacherQualification[]>;
  next_steps: string;
}

interface TeacherState {
  eligibility: TeacherEligibility | null;
  profile: TeacherProfile | null;
  isTeacher: boolean;
  loading: {
    eligibility: boolean;
    profile: boolean;
  };
  error: {
    eligibility: string | null;
    profile: string | null;
  };
}

const initialState: TeacherState = {
  eligibility: null,
  profile: null,
  isTeacher: false,
  loading: {
    eligibility: false,
    profile: false,
  },
  error: {
    eligibility: null,
    profile: null,
  },
};

// Async thunks
export const fetchTeacherEligibility = createAsyncThunk(
  'teacher/fetchEligibility',
  async (authHeaders: HeadersInit, { rejectWithValue }) => {
    try {
      const eligibility = await TeacherService.checkEligibility(authHeaders);
      return eligibility as TeacherEligibility;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch eligibility';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchTeacherProfile = createAsyncThunk(
  'teacher/fetchProfile',
  async (authHeaders: HeadersInit, { rejectWithValue, getState }) => {
    try {
      // Only try to fetch profile if user has one
      const state = getState() as { teacher: TeacherState };
      if (!state.teacher.eligibility?.has_teacher_profile) {
        return null;
      }
      
      const profile = await TeacherService.getMyProfile(authHeaders);
      return profile;
    } catch (error: unknown) {
      // If it's a 404, that's expected for non-teachers
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('404')) {
        return null;
      }
      return rejectWithValue(errorMessage || 'Failed to fetch teacher profile');
    }
  }
);

const teacherSlice = createSlice({
  name: 'teacher',
  initialState,
  reducers: {
    clearTeacherData: (state) => {
      state.eligibility = null;
      state.profile = null;
      state.isTeacher = false;
      state.error = { eligibility: null, profile: null };
    },
    setIsTeacher: (state, action: PayloadAction<boolean>) => {
      state.isTeacher = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Eligibility
    builder
      .addCase(fetchTeacherEligibility.pending, (state) => {
        state.loading.eligibility = true;
        state.error.eligibility = null;
      })
      .addCase(fetchTeacherEligibility.fulfilled, (state, action) => {
        state.loading.eligibility = false;
        state.eligibility = action.payload;
        state.isTeacher = action.payload.has_teacher_profile;
      })
      .addCase(fetchTeacherEligibility.rejected, (state, action) => {
        state.loading.eligibility = false;
        state.error.eligibility = action.payload as string;
        state.isTeacher = false;
      });

    // Profile
    builder
      .addCase(fetchTeacherProfile.pending, (state) => {
        state.loading.profile = true;
        state.error.profile = null;
      })
      .addCase(fetchTeacherProfile.fulfilled, (state, action) => {
        state.loading.profile = false;
        state.profile = action.payload;
      })
      .addCase(fetchTeacherProfile.rejected, (state, action) => {
        state.loading.profile = false;
        state.error.profile = action.payload as string;
      });
  },
});

export const { clearTeacherData, setIsTeacher } = teacherSlice.actions;
export default teacherSlice.reducer;