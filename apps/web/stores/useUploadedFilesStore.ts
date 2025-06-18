import { create } from 'zustand';

interface UploadedFilesState {
  uploadedFiles: Record<string, File[]>;
  addFiles: (rowId: string, files: File[]) => void;
  removeFile: (rowId: string, fileName: string) => void;
}

export const useUploadedFilesStore = create<UploadedFilesState>((set) => ({
  uploadedFiles: {},

  addFiles: (rowId, files) =>
    set((state) => ({
      uploadedFiles: {
        ...state.uploadedFiles,
        [rowId]: [...(state.uploadedFiles[rowId] || []), ...files],
      },
    })),

  removeFile: (rowId, fileName) =>
    set((state) => ({
      uploadedFiles: {
        ...state.uploadedFiles,
        [rowId]: (state.uploadedFiles[rowId] || []).filter(
          (file) => file.name !== fileName
        ),
      },
    })),
}));
