<template>
  <div>
    <b-form-group label="Is the boat’s home port in the state of Florida?" id="is-florida-label">
      <b-form-radio-group
        @change="preventDisabledAndChecked"
        id="is-florida-radio"
        v-model="isHomeportFlorida"
        :options="IsHomeportFloridaOptions"
        name="homeport-radio-options"
      ></b-form-radio-group>
    </b-form-group>

    <b-form-group label="Select Membership Type" id="membership-type-label">
      <b-form-radio-group
        id="card-selection-radio"
        v-model="CardSelection" 
        :options="CardOptions"
        name="cardtype-radio-options"
        stacked
      ></b-form-radio-group>
    </b-form-group>

    
    {{ CardSelection + ' Card' }}
    {{ CardPrices[0] }}
    {{ TotalFee }}
  </div>
</template>

<script>
export default {
  data() {
    return {
      isHomeportFlorida: false,
      IsHomeportFloridaOptions: [
        { text: "Yes", value: true },
        { text: "No", value: false }
      ],
      CardSelection: "Gold",
    };
  },
  computed: {
    CardPrices() {
      return [179.00, 119.00, 179.00, 179.00]
    },
    CardOptions() {
      return [
        { text: "Gold Card", value: "Gold" },
        { text: "Lake Card", value: "Lake", disabled: this.$data.isHomeportFlorida },
        { text: "Commerical Card", value: "Commercial" },
        { text: "Professional Mariner Card", value: "ProfMariner" }
      ];
    },
  },
  methods: {
    preventDisabledAndChecked(isHomeportInFlorida) {
      if (isHomeportInFlorida && this.$data.CardSelection == 'Lake') {
        document.getElementById('card-selection-radio_BV_option_0').checked = true
      }
    }
  }
};
</script>