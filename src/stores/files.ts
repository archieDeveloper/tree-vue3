import { defineStore } from "pinia";

export const useFilesStore = defineStore("files", {
  state: () => {
    return {
      treeData: [
        {
          name: "Dir 1",
          children: [
            {
              name: "Dir 1-1",
              children: [{ name: "File 1-1-1" }],
            },
            { name: "File 1-2" },
          ],
        },
        {
          name: "Dir 2",
          children: [{ name: "Dir 2-1", children: [] }, { name: "File 2-2" }],
        },
        { name: "File 2" },
      ],
    };
  },
  getters: {
    treeDataEmpty: (state): boolean => {
      return !(state.treeData?.length > 0);
    },
  },
  actions: {
    remove(index: number) {
      this.treeData.splice(index, 1);
    },

    change(index: number, newItem: never) {
      this.treeData[index] = newItem;
    },
  },
});
