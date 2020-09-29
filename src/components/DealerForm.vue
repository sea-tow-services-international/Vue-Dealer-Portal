<template>
  <div>
    <b-card bg-variant="light">
      <b-form-group
      label-cols-lg="3"
      label="Membership Questions"
      label-size="lg"
      label-class="font-weight-bold pt-0"
      class="mb-0"
    >

          <b-form-group
        label="Is the boat’s home port in the state of Florida?"
        label-align-sm="center"
        label-for="is-florida-radio"
        id="is-florida-label"
      >
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

    <b-form-group label="Roadside Assistance When Trailering" id="trailering-type-label">
      <b-form-radio-group
        id="trailering-selection-radio"
        v-model="TrailerSelection" 
        :options="TrailerOptions"
        name="trailering-radio-options"
        stacked
      ></b-form-radio-group>

      
    </b-form-group>
    </b-form-group>

          <b-row>

      <b-col> 
        <label for="buttn-group">Support safer boating by making a donation to the Sea Tow Foundation</label>
        
      </b-col>
      <b-col>
        <b-button-group>
          <b-button variant="outline-primary">5 Dollars</b-button>
          <b-button variant="outline-primary">10 Dollars</b-button>
          <b-button variant="outline-primary">25 Dollars</b-button>
        </b-button-group>
      </b-col>
      </b-row>

      <b-form-checkbox
      id="auto-renew-checkbox"
      v-model="autorenew_status"
      name="auto-renew-checkbox"
      value=true
      unchecked-value=false
    >
      Automatically Renew The Membership Each Year
    </b-form-checkbox>  
    </b-card>



    <div>
      <b-card bg-variant="light">
        <b-form-group
        label-cols-lg="3"
        label="Personal Information"
        label-size="lg"
        label-class="font-weight-bold pt-0"
        class="mb-0"
      >

      <b-row>
        <b-col>
          <b-form-group
        label-cols-sm="3"
        label="First Name:"
        label-align-sm="right"
        label-for="first-name"
      >
          <b-form-input id="first-name"></b-form-input>
          </b-form-group>

            <b-form-group
        label-cols-sm="3"
        label="Last Name:"
        label-align-sm="right"
        label-for="last-name"
      >
          <b-form-input id="last-name"></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      
      
      <b-form-group
        label-cols-sm="3"
        label="Email:"
        label-align-sm="right"
        label-for="email"
      >
        <b-form-input id="email"></b-form-input>
      </b-form-group>

            <b-form-group
        label-cols-sm="3"
        label="Primary Phone:"
        label-align-sm="right"
        label-for="primary-phone"
      >
        <b-form-input id="primary-phone"></b-form-input>
      </b-form-group>


            <b-form-group
        label-cols-sm="3"
        label="Secondary Phone:"
        label-align-sm="right"
        label-for="secondary-phone"
      >
        <b-form-input id="secondary-phone"></b-form-input>
      </b-form-group>
     </b-form-group>
    </b-card>



  <b-card bg-variant="light">
    <b-form-group
      label-cols-lg="3"
      label="Shipping Address"
      label-size="lg"
      label-class="font-weight-bold pt-0"
      class="mb-0"
    >
      <b-form-group
        label-cols-sm="3"
        label="Street:"
        label-align-sm="right"
        label-for="nested-street"
      >
        <b-form-input id="nested-street"></b-form-input>
      </b-form-group>


        <b-form-group
        label-cols-sm="3"
        label="Street 2:"
        label-align-sm="right"
        label-for="nested-street2"
      >
        <b-form-input id="nested-street2"></b-form-input>
      </b-form-group>

      <b-form-group
        label-cols-sm="3"
        label="City:"
        label-align-sm="right"
        label-for="nested-city"
      >
        <b-form-input id="nested-city"></b-form-input>
      </b-form-group>

      <b-form-group
        label-cols-sm="3"
        label="State:"
        label-align-sm="right"
        label-for="nested-state"
      >
        <b-form-input id="nested-state"></b-form-input>
      </b-form-group>
      <b-form-group
        label-cols-sm="3"
        label="Zipcode:"
        label-align-sm="right"
        label-for="nested-postal"
      >
        <b-form-input id="nested-postal"></b-form-input>
      </b-form-group>

      <b-form-group
        label-cols-sm="3"
        label="Country:"
        label-align-sm="right"
        label-for="nested-country"
      >
        <b-form-input id="nested-country"></b-form-input>
      </b-form-group>

      <b-form-group
        label-cols-sm="3"
        label="Ship via:"
        label-align-sm="right" class="mb-0"
      >
        <b-form-radio-group
          class="pt-2"
          :options="['Air', 'Courier', 'Mail']"
        ></b-form-radio-group>
      </b-form-group>
    </b-form-group>

  </b-card>
</div>

      
    </div>
</template>

<script>
export default {
  data() {
    return {
      autorenew_status: false,
      isHomeportFlorida: false,
      IsHomeportFloridaOptions: [
        { text: "Yes", value: true },
        { text: "No", value: false }
      ],
      CardSelection: "Gold",
      TrailerOptions: [
        { text: "Trailer Care Marine", value: 'marine' },
        { text: "Trailer Care Universal", value: 'universal' },
        { text: "No Roadside Assistance", value: 'none' }
      ],
      TrailerSelection: "none",
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