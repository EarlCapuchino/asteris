import create from 'zustand';

const useLoadStore = create((set) => ({
  isLoading: false,
  setIsLoading: (isLoading) => set((state) => {
    state.isLoading = isLoading
  })
}))

export default useLoadStore;