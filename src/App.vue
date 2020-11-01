<template>
  <main>
    <div
      class="playBox"
      :style="[mainBgStyle, { backgroundImage: `url('${activeSong.cover}')` }]"
    >
      <div class="blur"></div>
      <div class="playBox-content">
        <nav class="playBox-bar">
          <h1 class="title">TIME WILL TELL</h1>
        </nav>
        <div
          class="coverImg"
          :style="[
            coverImgStyle,
            { backgroundImage: `url('${activeSong.cover}')` }
          ]"
        ></div>
        <div class="song-content">
          <h2 class="song-title">{{ activeSong.name }}</h2>
          <h2 class="song-singer">田馥甄</h2>
        </div>
        <div class="song-time">
          <p class="time-start">{{ duration }}</p>
          <div class="time-bar">
            <div class="time-run" :style="barWidth"></div>
            <div class="time-control" :style="controlTranslate"></div>
          </div>
          <p class="time-end">{{ endTime }}</p>
        </div>
        <div class="control">
          <font-awesome-icon class="icon" icon="redo" />
          <font-awesome-icon
            class="icon"
            icon="step-backward"
            @click="prevSong"
          />
          <font-awesome-icon
            v-if="playMode"
            class="icon icon-play"
            icon="pause"
            @click="togglePlay"
          />
          <font-awesome-icon
            v-else
            class="icon icon-play"
            icon="play"
            @click="togglePlay"
          />
          <font-awesome-icon
            class="icon"
            icon="step-forward"
            @click="nextSong"
          />
          <font-awesome-icon
            v-if="straightMode"
            class="icon"
            icon="long-arrow-alt-right"
            @click="changeMode"
          />

          <font-awesome-icon
            v-else
            class="icon"
            icon="random"
            @click="changeMode"
          />
        </div>
      </div>
      <font-awesome-icon class="song-list-btn" icon="list" @click="openModal" />
      <list-modal :open="isShowModal" @close="closeModal">
        <template #default>
          <ul>
            <li
              v-for="(song, index) in songList"
              :key="song.name"
              @click="changeSong(index)"
            >
              {{ song.name }}
            </li>
          </ul>
        </template>
      </list-modal>
    </div>
  </main>
</template>

<script>
import ListModal from "./components/ListModal.vue";
import { dummyData } from "./dummyData.js";

export default {
  components: {
    ListModal
  },
  data() {
    return {
      songList: dummyData,
      activeIdx: 0,
      activeSong: null,
      songTime: null,
      straightMode: true,
      playMode: true,
      isShowModal: false,
      timer: ""
    };
  },
  created() {
    this.activeSong = this.songList[0];
    this.songTime = this.activeSong.time;
  },
  mounted() {
    this.setTime();
  },
  beforeUnmount() {
    clearInterval(this.timer);
  },
  watch: {
    songTime() {
      if (this.songTime <= 0) {
        clearInterval(this.timer);
        this.nextSong();
        this.setTime();
      }
    }
  },
  computed: {
    duration() {
      const durationTime = this.activeSong.time - this.songTime;
      let second = durationTime % 60;
      let minute = Math.floor(durationTime / 60);
      if (second === 0) {
        second = "00";
      } else if (second < 10) {
        second = "0" + second;
      }
      if (minute === 0) {
        minute = "00";
      } else if (minute < 10) {
        minute = "0" + minute;
      }
      return minute + " : " + second;
    },
    endTime() {
      const time = this.activeSong.time;
      let second = time % 60;
      let minute = Math.floor(time / 60);
      if (second === 0) {
        second = "00";
      } else if (second < 10) {
        second = "0" + second;
      }
      if (minute === 0) {
        minute = "00";
      } else if (minute < 10) {
        minute = "0" + minute;
      }
      return minute + " : " + second;
    },
    mainBgStyle() {
      return {
        position: "relative",
        width: "500px",
        "background-color": "#fff",
        display: "flex",
        "justify-content": "center",
        "background-position": "50% top"
      };
    },
    coverImgStyle() {
      return {
        width: "80%",
        "padding-bottom": "80%",
        "background-size": "cover",
        "background-position": "50% 50%",
        "box-shadow": "5px 3px 2px rgba(0,0,0,.8)"
      };
    },
    barPercentage() {
      const duration = this.activeSong.time - this.songTime;
      const barPercentage = (duration / this.activeSong.time) * 100;
      return barPercentage;
    },
    barWidth() {
      const barPercent = this.barPercentage;
      if (barPercent === 100) {
        return {
          width: "100%"
        };
      }
      return {
        width: `${barPercent}%`
      };
    },
    controlTranslate() {
      const barPercent = this.barPercentage;
      if (barPercent === 100) {
        return {
          left: "100%"
        };
      }
      return {
        left: `${barPercent}%`
      };
    }
  },
  methods: {
    setTime() {
      this.timer = setInterval(() => {
        if (this.playMode) {
          this.songTime--;
        }
      }, 1000);
    },
    changeSong(songIndex) {
      this.activeIdx = songIndex;
      this.activeSong = this.songList[songIndex];
      this.songTime = this.activeSong.time;
      this.isShowModal = false
    },
    nextSong() {
      let nextIdx = this.activeIdx + 1;
      if (nextIdx > this.songList.length - 1) {
        nextIdx = 0;
      }
      this.activeIdx = nextIdx;
      this.activeSong = this.songList[nextIdx];
      this.songTime = this.activeSong.time;
    },
    prevSong() {
      let prevIdx = this.activeIdx - 1;
      if (prevIdx < 0) {
        prevIdx = this.songList.length;
      }
      this.activeIdx = prevIdx;
      this.activeSong = this.songList[prevIdx];
      this.songTime = this.activeSong.time;
    },
    changeMode() {
      this.straightMode = !this.straightMode;
      if (!this.straightMode) {
        this.shuffle();
      } else {
        this.songList = dummyData;
      }
    },
    togglePlay() {
      this.playMode = !this.playMode;
    },
    shuffle() {
      const dataArray = [...this.songList];
      for (let i = dataArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [dataArray[i], dataArray[j]] = [dataArray[j], dataArray[i]];
      }
      this.songList = dataArray;
    },
    openModal() {
      this.isShowModal = true;
    },
    closeModal() {
      this.isShowModal = false;
    }
  }
};
</script>

<style lang="sass">

@import url('https://fonts.googleapis.com/css2?family=Dosis&display=swap')

*
  box-sizing: border-box

html
  font-family: 'Dosis', sans-serif

body
  margin: 0

main
  width: 100vw
  height: 100vh
  background-color: #eee
  display: flex
  justify-content: center

.playBox

.blur
  background: rgba(0, 0, 0, 0.6)
  backdrop-filter: blur(8px)
  width: 500px
  position: absolute
  top: 0
  left: 0
  bottom: 0
  right: 0

.playBox-bar
  padding: 12px 0
  .title
    margin: 0
    font-weight: 500
    color: #ffffff

.playBox-content
  width: 100%
  z-index: 2
  display: flex
  flex-direction: column
  align-items: center

.coverImg
.song-content
  margin: 12px 0
  h2
    margin: 0
    text-align: center
    font-weight: normal
    margin: 6px 0
  .song-title
    font-size: 16px
    color: #fff
  .song-singer
    color: #7f7f7f
    font-size: 12px

.song-time
  width: 80%
  display: flex
  justify-content: space-around
  align-items: center
  color: #fff
  p
    font-size: 12px
  .time-bar
    position: relative
    height: 2px
    background-color: #828282
    width: 300px
    .time-run
      position: absolute
      top: 0
      bottom: 0
      left: 0
      background-color: red
      width: 0%
    .time-control
      position: absolute
      left: 0%
      transform: translate(-50%,-50%)
      width: 10px
      height: 10px
      border-radius: 50%
      box-shadow: 2px 2px 2px rgba(0,0,0,.3)
      background-color: #fff
      cursor: pointer

.control
  width: 80%
  display: flex
  align-items: center
  justify-content: space-around
  margin-top: 12px
  .icon
    color: #fff
    cursor: pointer
  .icon-play
    font-size: 28px

.song-list-btn
  position: absolute
  bottom: 20px
  left: 50%
  transform: translateX(-50%)
  z-index: 2
  cursor: pointer
  color: #fff
</style>
