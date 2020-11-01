<template>
  <transition name="modal">
    <div class="modal" v-if="open">
      <nav class="modal-bar">
        <p class="close-btn" @click="$emit('close')">CLOSE</p>
        <p>現正播放</p>
        <p>LIST</p>
      </nav>
      <slot></slot>
    </div>
  </transition>
</template>

<script>
export default {
  props: ["open"],
  emits: ["close"]
};
</script>

<style lang="sass">

.modal
  z-index: 2
  position: absolute
  width: 100%
  height: 100vh
  background-color: #555555
  padding: 16px 40px


.modal-bar
  display: flex
  justify-content: space-between
  align-items: center
  color: #fff
  font-weight: bold

.close-btn
  cursor: pointer

ul
  list-style: none
  padding: 0
  margin: 0

li
  cursor: pointer
  padding: 10px 0
  color: #fff
  border-bottom: #a5a5a5 1px solid

.modal-enter-active
  animation: modal 0.3s ease-out

.modal-leave-active
  animation: modal 0.3s ease-in reverse


@keyframes modal
  from
    transform: translateY(100%)

  to
    transform: translateY(0)
</style>
