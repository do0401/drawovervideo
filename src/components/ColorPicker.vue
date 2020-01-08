<template>
  <v-app>
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
</style>