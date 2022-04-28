<script setup lang="ts">
import { ref, computed } from "vue";
import TreeItem from "@/components/TreeItem.vue";

/**
 * Задача:
 *
 * Написать приложение на vue.js (версии 2 или 3) для вывода дерева
 * папок и файлов с возможностью редактирования названия и удаления
 * элементов. Для хранения состояния использовать vuex (либо
 * аналогичный инструмент).
 *
 * Начальная структура дерева:
 * - Dir 1
 * -- Dir 1-1
 * --- File 1-1-1
 * -- File 1-2
 * - Dir 2
 * -- Dir 2-1
 * -- File 2-2
 * - File 2
 *
 * Основные требования:
 * - аккуратность, чистота кода
 * - комментарии в коде для непонятных участков
 */

const treeData = ref([
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
]);

const treeDataEmpty = computed((): boolean => {
  return !(treeData.value?.length > 0);
});

function change(index: number, newItem: never) {
  treeData.value[index] = newItem;
}

function remove(index: number) {
  treeData.value.splice(index, 1);
}
</script>

<template>
  <div class="p-small">
    <div class="tree-root text-light">
      <div class="border p-small px-normal border-bottom-none text-heading">
        Файлы
      </div>
      <ul class="border p-small px-normal ul-clear">
        <li v-if="treeDataEmpty">Пусто 😟</li>
        <template v-else>
          <TreeItem
            v-for="(item, itemIndex) in treeData"
            :key="item.name + itemIndex"
            class="item"
            :name="item.name"
            :children="item.children"
            @change="change(itemIndex, $event)"
            @remove="remove(itemIndex)"
          />
        </template>
      </ul>
    </div>
  </div>
</template>

<style>
@import "@/assets/base.css";

#app {
  margin: 0 auto;
  padding: 2rem;

  font-weight: normal;
}

.position-absolute {
  position: absolute;
}

.position-relative {
  position: relative;
}

.flex-fixed {
  flex: 0 1 auto !important;
}

.flex-content {
  flex: 1 1 0 !important;
}

.d-flex {
  display: flex;
}

.d-block {
  display: block;
}

.d-inline-block {
  display: inline-block;
}

.align-items-center {
  align-items: center;
}

.mr-small {
  margin-right: 0.3125rem;
}

.ml-small {
  margin-left: 0.3125rem;
}

.ml-auto {
  margin-left: auto;
}

.ul-clear {
  list-style-type: none;
  margin: 0;
  padding-inline-start: 0.625rem;
}

.tree-root {
  width: 17.5rem;
}

.bg-dark {
  background-color: var(--color-background);
}

.border {
  border: 1px solid var(--color-border);
}

.border-bottom-none {
  border-bottom: none;
}

.p-small {
  padding: 0.3125rem;
}

.px-normal {
  padding-left: 0.625rem;
  padding-right: 0.625rem;
}

.text-light {
  color: var(--color-text);
}

.text-heading {
  color: var(--color-heading);
}

.icon-svg {
  height: 0.75rem;
  width: 0.75rem;
}
</style>
