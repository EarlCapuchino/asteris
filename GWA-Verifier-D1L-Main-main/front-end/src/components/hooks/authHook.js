import create from 'zustand';

const useStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  host: process.env.REACT_APP_HOST_IP,
  setAuth: (user, isAuthenticated) => set((state) => {
    state.user = user
    state.isAuthenticated = isAuthenticated
  })
}))

export default useStore;