<template>
  <v-app>
    <v-card class="strokeWidth--wrap" outlined>
      <v-container class="d-flex" grid-list-xs>
        <!-- <v-text-field label="Stroke Width" hide-details="auto"></v-text-field> -->
        <v-slider v-model="setStroke" label="Stroke Width" min="1" max="10">{{ strokeWidth }}</v-slider>
        <p class="strokeWidth--value font-weight-light">{{ strokeWidth }}</p>
      </v-container>
    </v-card>
    <v-card class="colorPicker--wrap" outlined>
      <v-container class="colorPicker--container" grid-list-xs>
        <v-sheet dark class="strokeText--wrap pa-2">
          <p id="strokeText">Stroke Color: {{ color }}</p>
        </v-sheet>
        <v-spacer></v-spacer>
        <v-color-picker
          v-model="setColor"
          :hide-canvas="hideCanvas"
          :hide-inputs="hideInputs"
          :hide-mode-switch="hideModeSwitch"
          :mode.sync="mode"
          :show-swatches="showSwatches"
        ></v-color-picker>
      </v-container>
    </v-card>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
      color: '#E62B2B',
      strokeWidth: 3,
      hideCanvas: false,
      hideInputs: false,
      hideModeSwitch: false,
      mode: 'rgba',
      modes: ['rgba', 'hsla', 'hexa'],
      showSwatches: false,
    }),

    computed: {
      setColor: {
        get () {
          return this.color
        },
        set (v) {
          this.color = v
          this.$store.state.strokeColor = v
        }
      },

      setStroke: {
        get () {
          return this.strokeWidth
        },
        set (v) {
          this.strokeWidth = v
          this.$store.state.strokeWidth = v
          // eslint-disable-next-line no-console
          console.log(v)
        }
      }
    },

    methods: {
      setStrokeColorState () {
        const strokeText = document.getElementById("strokeText")

        strokeText.addEventListener("change", () => {
          // eslint-disable-next-line no-console
          console.log("change");
        })
      }
    }
  }
</script>

<style>
  .colorPicker--wrap {
    position: relative;
    align-self: flex-start;
    margin-top: 10px;
  }

  .strokeText--wrap {
    margin-bottom: 5px;
  }

  #strokeText {
    text-align: center;
    margin-bottom: 0;
  }

  .strokeWidth--wrap {
    margin-top: 10px;
    width: 300px;
    height: 55px;
  }

  .strokeWidth--value {
    line-height: 30px;
  }
</style>