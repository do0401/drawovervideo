<template>
  <v-card class="d-flex flex-row mt-2" width="700px" outlined="">
    <div class="pa-2">
      <v-card class="strokeDash--wrap mt-2" outlined>
        <v-container class="d-flex" grid-list-xs>
          <v-slider v-model="setDash" label="Dash" min="0" max="10">{{ strokeDash }}</v-slider>
          <p class="strokeWidth--value font-weight-light">{{ strokeDash }}</p>
        </v-container>
      </v-card>
      <v-card class="strokeWidth--wrap mt-2" outlined>
        <v-container class="d-flex" grid-list-xs>
          <!-- <v-text-field label="Stroke Width" hide-details="auto"></v-text-field> -->
          <v-slider v-model="setStrokeWidth" label="Stroke Width" min="1" max="10">{{ strokeWidth }}</v-slider>
          <p class="strokeWidth--value font-weight-light">{{ strokeWidth }}</p>
        </v-container>
      </v-card>
      <v-card class="colorPicker--wrap mt-2" outlined>
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
    </div>
    <div class="pa-2">
      <v-card class="lineArrow--wrap mt-2" width="325px" height="55px" outlined>
        <v-container class="d-flex justify-center mt-3 pa-0" grid-list-xs>
          <v-switch
              v-model="setArrow"
              label="Arrow Type"
              color="success"
              value="arrow"
              hide-details
              class="ma-0"
            ></v-switch>
        </v-container>
      </v-card>
    </div>
  </v-card>
</template>

<script>
  export default {
    data: () => ({
      color: '#E62B2B',
      strokeWidth: 3,
      strokeDash: 0,
      arrow: false,
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

      setStrokeWidth: {
        get () {
          return this.strokeWidth
        },
        set (v) {
          this.strokeWidth = v
          this.$store.state.strokeWidth = v
        }
      },

      setDash: {
        get () {
          return this.strokeDash
        },
        set (v) {
          this.strokeDash = v
          this.$store.state.dash = [v, v]
        }
      },

      setArrow: {
        get () {
          return this.arrow
        },
        set (v) {
          this.arrow = v
          this.$store.state.arrow = v
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
      },

      getDrawType () {
        // eslint-disable-next-line no-console
        console.log(this.$store.state.drawType)
      }
    }
  }
</script>

<style>
  .colorPicker--wrap {
    position: relative;
    align-self: flex-start;
    width: 325px;
  }

  .strokeText--wrap {
    margin-bottom: 5px;
  }

  #strokeText {
    text-align: center;
    margin-bottom: 0;
  }

  .strokeDash--wrap {
    /* margin-top: 10px; */
    width: 325px;
    height: 55px;
  }

  .strokeWidth--wrap {
    /* margin-top: 10px; */
    width: 325px;
    height: 55px;
  }

  .strokeWidth--value {
    line-height: 30px;
  }
</style>