import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Plan = "basic" | "premium" | "premium-plus";

interface UserState {
  uid: string | null;
  email: string | null;
  ready: boolean;
  plan: Plan;
}

const initialState: UserState = {
  uid: null,
  email: null,
  ready: false,
  plan: "basic",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(
      state,
      action: PayloadAction<{
        uid: string;
        email: string | null;
        plan: Plan;
      } | null>,
    ) {
      state.uid = action.payload?.uid ?? null;
      state.email = action.payload?.email ?? null;
      state.plan = action.payload?.plan ?? "basic";
      state.ready = true;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;