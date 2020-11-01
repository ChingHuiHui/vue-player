import { createApp } from "vue";
import App from "./App.vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faStepBackward,
  faStepForward,
  faPlay,
  faPause,
  faRandom,
  faLongArrowAltRight,
  faRedo,
  faList
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
  faStepBackward,
  faStepForward,
  faPlay,
  faPause,
  faRandom,
  faLongArrowAltRight,
  faRedo,
  faList
);
const app = createApp(App);
app.component("font-awesome-icon", FontAwesomeIcon);
app.mount("#app");
