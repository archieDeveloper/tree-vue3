<script setup lang="ts">
import IconFolderOpen from "@/components/icons/IconFolderOpen.vue";
import IconFile from "@/components/icons/IconFile.vue";
import IconPen from "@/components/icons/IconPen.vue";
import IconMultiply from "@/components/icons/IconMultiply.vue";

import { ref, computed, nextTick } from "vue";
import type { Ref, ComputedRef } from "vue";

interface Props {
  name: string;
  children?: Props[];
}

interface Emits {
  (e: "change", newItem: Props): void;
  (e: "remove"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const isEdit: Ref<boolean> = ref(false);
const editName: Ref<string> = ref(props.name);
const inputEdit: Ref<HTMLInputElement | null> = ref(null);

const isFolder: ComputedRef<boolean> = computed((): boolean => {
  return Array.isArray(props.children);
});

function setEditMode(isEditMode: boolean): void {
  isEdit.value = Boolean(isEditMode);
}

function doEdit(): void {
  setEditMode(true);
  nextTick(() => {
    if (typeof inputEdit.value?.focus === "function") {
      inputEdit.value.focus();
    }
  });
}

function doRemove(): void {
  emit("remove");
}

function doSave(): void {
  const newName = editName.value.trim();
  if (newName) {
    emit("change", {
      name: newName,
      children: props.children,
    });
  } else {
    editName.value = props.name;
  }
  setEditMode(false);
}

function changeTreeItem(
  index: number,
  changeCb: (children: Props[]) => Props[]
) {
  if (Array.isArray(props.children)) {
    const model = props.children[index];
    if (model && typeof changeCb === "function") {
      const newChildren = changeCb([...props.children]);
      emit("change", {
        name: props.name,
        children: newChildren,
      });
    }
  }
}

function change(index: number, newItem: Props): void {
  changeTreeItem(index, (children) => {
    children[index] = newItem;
    return children;
  });
}

function remove(index: number): void {
  changeTreeItem(index, (children) => {
    children.splice(index, 1);
    return children;
  });
}
</script>

<template>
  <li>
    <div class="tree-item d-flex align-items-center">
      <component
        :is="isFolder ? IconFolderOpen : IconFile"
        class="icon-svg mr-small flex-fixed position-absolute"
        width="12"
        height="12"
      />
      <input
        v-if="isEdit"
        ref="inputEdit"
        v-model="editName"
        class="flex-content input-edit-name"
        type="text"
        @blur="doSave"
        @keydown.enter="doSave"
      />
      <template v-else>
        <div class="d-inline-block tree-item-name-wrap flex-content">
          <div class="tree-item-name text-heading" :title="name">
            {{ name }}
          </div>
        </div>
        <div class="tree-item-controls d-flex align-items-center ml-auto">
          <button
            class="button-icon ml-small"
            title="Редактировать"
            @click="doEdit"
          >
            <IconPen class="d-block icon-svg" width="12" height="12" />
          </button>
          <button
            class="button-icon ml-small"
            title="Удалить"
            @click="doRemove"
          >
            <IconMultiply class="d-block icon-svg" width="12" height="12" />
          </button>
        </div>
      </template>
    </div>
    <ul v-if="isFolder" class="ul-clear">
      <TreeItem
        class="item"
        v-for="(childModel, childModelIndex) in children"
        :name="childModel.name"
        :children="childModel.children"
        :key="childModel.name + childModelIndex"
        @change="change(childModelIndex, $event)"
        @remove="remove(childModelIndex)"
      />
    </ul>
  </li>
</template>

<style scoped>
.tree-item-controls {
  visibility: hidden;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: var(--color-background);
  box-shadow: -0.625rem 0 0.625rem 0 var(--color-background);
}
.tree-item {
  position: relative;
}
.tree-item:hover .tree-item-controls {
  visibility: visible;
}
.tree-item-name-wrap {
  padding-left: 1.0625rem;
  max-width: 100%;
}
.tree-item-name {
  padding: 0.0625rem 0.125rem;
  line-height: normal;
  border: 0.0625rem solid transparent;
  width: 100%;

  font-size: inherit;
  text-align: left;
  display: block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.button-icon {
  border: none;
  background: transparent;
  padding: 5px;
  margin: 0;
  color: inherit;
  cursor: pointer;
}
.button-icon:hover {
  color: var(--color-heading);
}
.input-edit-name {
  padding: 0.0625rem 0.125rem;
  margin-left: 1.0625rem;
  width: 100%;
  background-color: var(--color-background);
  color: var(--color-text);
  outline: none;
  border: 0.0625rem solid var(--color-border);
}
</style>
