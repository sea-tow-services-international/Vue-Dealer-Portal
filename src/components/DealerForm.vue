<template>
  <div>
    <b-form @submit.prevent="submitForm" id="dealer-form">
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

          <b-form-group label="Select Membership Type">
            <b-form-radio-group
              id="card-selection-radio"
              @change="updateCartPrice($event)"
              v-model="CardSelection"
              :options="CardOptions"
              name="cardtype-radio-options"
              stacked
            ></b-form-radio-group>
          </b-form-group>

          <b-form-group
            label="Roadside Assistance When Trailering"
            id="trailering-type-label"
          >
            <b-form-radio-group
              id="trailering-selection-radio"
              @change="updateCartPrice($event)"
              v-model="TrailerSelection"
              :options="TrailerOptions"
              name="trailering-radio-options"
              stacked
            ></b-form-radio-group>
          </b-form-group>

          <b-form-checkbox
            id="auto-renew-checkbox"
            v-model="autorenew_status"
            name="auto-renew-checkbox"
            value="true"
            unchecked-value="false"
          >
            Automatically Renew The Membership Each Year
          </b-form-checkbox>
        </b-form-group>
      </b-card>

      <b-card bg-variant="light">
        <b-form-group
          label-cols-lg="3"
          label="Personal Information"
          label-size="lg"
          label-class="font-weight-bold pt-0"
          class="mb-0"
        >
          <b-form-group
            label-cols-sm="2"
            label="First Name:"
            label-align-sm="left"
            label-for="first-name"
          >
            <b-form-input id="first-name" v-model="$v.firstName.$model">
            </b-form-input>
            <span
              v-if="!$v.firstName.required && $v.firstName.$dirty"
              class="text-danger"
              >First Name is required!
            </span>
          </b-form-group>

          <b-form-group
            label-cols-sm="2"
            label="Last Name:"
            label-align-sm="left"
            label-for="last-name"
          >
            <b-form-input id="last-name" v-model="$v.lastName.$model">
            </b-form-input>

            <span
              v-if="!$v.lastName.required && $v.lastName.$dirty"
              class="text-danger"
              >Last Name is required!
            </span>
          </b-form-group>

          <b-form-group
            label-cols-sm="2"
            label="Email:"
            label-align-sm="left"
            label-for="email"
          >
            <b-form-input id="email" v-model="$v.email.$model"></b-form-input>
            <span
              v-if="!$v.email.required && $v.email.$dirty"
              class="text-danger"
              >Email is required!
            </span>

            <span v-if="!$v.email.email" class="text-danger"
              >Email must be a valid email address
            </span>
          </b-form-group>

          <b-form-group
            label-cols-sm="2"
            label="Primary Phone:"
            label-align-sm="left"
            label-for="primary-phone"
          >
            <b-form-input
              id="primary-phone"
              v-model="$v.primaryPhone.$model"
            ></b-form-input>
            <span
              v-if="!$v.primaryPhone.required && $v.primaryPhone.$dirty"
              class="text-danger"
              >Primary Phone is required!
            </span>

            <span
              v-if="!$v.primaryPhone.integer && $v.primaryPhone.$dirty"
              class="text-danger"
              >Phone numbers should consist of only numbers. ex: 6315664283
            </span>

            <span
              v-if="
                $v.primaryPhone.integer &&
                  !$v.primaryPhone.minlength &&
                  $v.primaryPhone.$dirty
              "
              class="text-danger"
              >Phone numbers must be at least 9 digits long.
            </span>
          </b-form-group>

          <b-form-group
            label-cols-sm="2"
            label="Secondary Phone:"
            label-align-sm="left"
            label-for="secondary-phone"
          >
            <b-form-input
              id="secondary-phone"
              v-model="$v.secondaryPhone.$model"
            ></b-form-input>
            <span
              v-if="!$v.secondaryPhone.integer && $v.secondaryPhone.$dirty"
              class="text-danger"
              >Phone numbers should consist of only numbers. ex: 6315664283
            </span>

            <span
              v-if="
                $v.secondaryPhone.integer &&
                  !$v.secondaryPhone.minlength &&
                  $v.secondaryPhone.$dirty
              "
              class="text-danger"
              >Phone numbers must be at least 9 digits long.
            </span>
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
            label-cols-sm="2"
            label="Street:"
            label-align-sm="left"
            label-for="nested-street"
          >
            <b-form-input
              id="nested-street"
              v-model="$v.street.$model"
            ></b-form-input>
            <span
              v-if="!$v.street.required && $v.street.$dirty"
              class="text-danger"
              >Street is required!
            </span>
          </b-form-group>

          <b-form-group
            label-cols-sm="2"
            label="Street 2:"
            label-align-sm="left"
            label-for="nested-street2"
          >
            <b-form-input
              id="nested-street2"
              v-model="$v.street2.$model"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            label-cols-sm="2"
            label="City:"
            label-align-sm="left"
            label-for="nested-city"
          >
            <b-form-input
              id="nested-city"
              v-model="$v.city.$model"
            ></b-form-input>
            <span v-if="!$v.city.required && $v.city.$dirty" class="text-danger"
              >City is required!
            </span>
          </b-form-group>

          <b-form-group
            label-cols-sm="2"
            label="State:"
            label-align-sm="left"
            label-for="nested-state"
          >
            <b-form-input
              id="nested-state"
              v-model="$v.state.$model"
            ></b-form-input>
            <span
              v-if="!$v.state.required && $v.state.$dirty"
              class="text-danger"
              >State is required!
            </span>
          </b-form-group>
          <b-form-group
            label-cols-sm="2"
            label="Zipcode:"
            label-align-sm="left"
            label-for="nested-postal"
          >
            <b-form-input
              id="nested-postal"
              v-model="$v.zipcode.$model"
            ></b-form-input>
            <span
              v-if="!$v.zipcode.required && $v.zipcode.$dirty"
              class="text-danger"
              >Zipcode is required!
            </span>
          </b-form-group>

          <b-form-group
            label-cols-sm="2"
            label="Country:"
            label-align-sm="left"
            label-for="nested-country"
          >
            <b-form-input
              id="nested-country"
              v-model="$v.country.$model"
            ></b-form-input>
            <span
              v-if="!$v.country.required && $v.country.$dirty"
              class="text-danger"
              >Country is required!
            </span>
          </b-form-group>
        </b-form-group>
      </b-card>

      <b-card bg-variant="light">
        <b-form-group
          label-cols-lg="3"
          label="Boat Information"
          label-size="lg"
          label-class="font-weight-bold pt-0"
          class="mb-0"
        >
          <b-form-group
            label-cols-sm="2"
            label="Year:"
            label-align-sm="left"
            label-for="nested-year"
          >
            <b-form-input id="nested-year" v-model="$v.boat_year.$model">
            </b-form-input>
            <span
              v-if="!$v.boat_year.integer && $v.boat_year.$dirty"
              class="text-danger"
              >Boat year must be a year and contain no letters
            </span>
            <span
              v-if="!$v.boat_year.required && $v.boat_year.$dirty"
              class="text-danger"
              >Boat Year is required!
            </span>
            <span
              v-if="
                !$v.boat_year.between &&
                  $v.boat_year.$dirty &&
                  $v.boat_year.integer
              "
              class="text-danger"
              >Boat year must be between 1990 and 2021. No matter the age, the
              boat must be in good working order in order to be serviced by Sea
              Tow.
            </span>
          </b-form-group>

          <b-form-group
            label-cols-sm="2"
            label="Length:"
            label-align-sm="left"
            label-for="nested-length"
          >
            <b-form-input
              id="nested-length"
              v-model="$v.boat_length.$model"
            ></b-form-input>
            <span
              v-if="!$v.boat_length.required && $v.boat_length.$dirty"
              class="text-danger"
              >Boat Length is required!
            </span>
            <span
              v-if="!$v.boat_length.integer && $v.boat_length.$dirty"
              class="text-danger"
              >Boat Length in whole feet only
            </span>
            <span
              v-if="
                !$v.boat_length.between &&
                  $v.boat_length.$dirty &&
                  $v.boat_length.integer
              "
              class="text-danger"
              >Sea Tow generally generally accepts boats between 1'-100' feet.
              Below or above that may required special authorization.
            </span>
          </b-form-group>

          <b-form-group
            label-cols-sm="2"
            label="Make:"
            label-align-sm="left"
            label-for="nested-make"
          >
            <b-form-input
              id="nested-make"
              v-model="$v.boat_make.$model"
            ></b-form-input>
            <span
              v-if="!$v.boat_make.required && $v.boat_make.$dirty"
              class="text-danger"
              >Boat Make is required!
            </span>
          </b-form-group>

          <b-form-group
            label-cols-sm="2"
            label="Registration/Document Number:"
            label-align-sm="left"
            label-for="nested-doc-num"
          >
            <b-form-input
              id="nested-doc-num"
              v-model="$v.boat_doc.$model"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            label-cols-sm="2"
            label="Boat is kept at:"
            label-align-sm="left"
          >
            <b-form-select
              v-model="$v.boat_kept_at.$model"
              :options="boat_kept_at_options"
              class="mb-3"
            >
              <!-- This slot appears above the options from 'options' prop -->
              <template v-slot:first>
                <b-form-select-option :value="null" disabled
                  >-- Please select an option --</b-form-select-option
                >
              </template>
            </b-form-select>
            <span
              v-if="!$v.boat_kept_at.required && $v.boat_kept_at.$dirty"
              class="text-danger"
              >Boat Location is required!
            </span>
          </b-form-group>

          <b-form-group
            label-cols-sm="2"
            label="Boat Location City:"
            label-align-sm="left"
            label-for="nested-boat-city"
          >
            <b-form-input
              id="nested-boat-city"
              v-model="$v.boat_loc_city.$model"
            ></b-form-input>
            <span
              v-if="!$v.boat_loc_city.required && $v.boat_loc_city.$dirty"
              class="text-danger"
              >Boat City is required!
            </span>
          </b-form-group>

          <b-form-group
            label-cols-sm="2"
            label="Boat Location State:"
            label-align-sm="left"
            label-for="nested-boat-state"
          >
            <b-form-input
              id="nested-boat-state"
              v-model="$v.boat_loc_state.$model"
            ></b-form-input>
            <span
              v-if="!$v.boat_loc_state.required && $v.boat_loc_state.$dirty"
              class="text-danger"
              >Boat State is required!
            </span>
          </b-form-group>

          <b-form-group
            label-cols-sm="2"
            label="Boat Location Country:"
            label-align-sm="left"
            label-for="nested-country"
          >
            <b-form-input
              id="nested-boat-country"
              v-model="$v.boat_loc_country.$model"
            ></b-form-input>
            <span
              v-if="!$v.boat_loc_country.required && $v.boat_loc_country.$dirty"
              class="text-danger"
              >Boat Country is required!
            </span>
          </b-form-group>
        </b-form-group>

        <b-form-group
          label-cols-lg="2"
          label="Summary"
          label-size="lg"
          label-class="font-weight-bold pt-0"
          class="mb-0"
        >
        </b-form-group>

        <b-container class="bv-example-row">
          <b-row>
            <b-col>Total Price</b-col>
            <b-col>{{ price_total }}</b-col>
          </b-row>

          <b-row>
            <b-col>Card Selection</b-col>
            <b-col>{{ CardSelection }}</b-col>
          </b-row>

          <b-row>
            <b-col>Trailering Selection</b-col>
            <b-col>{{ TrailerSelection }}</b-col>
          </b-row>

          <b-row>
            <b-col>Auto Renew Selection</b-col>
            <b-col>{{ autorenew_status }}</b-col>
          </b-row>
        </b-container>
        <label for="by continuing">
          By continuing, the user verifies that their boats are in good working
          order and understand that Dock-to-Dock tows from the boat’s home port
          to a repair facility, a ramp for haul out or similar, are not covered
          for the first 30 days after membership activation.</label
        >

        <!-- <b-button type="submit" variant="primary" :disabled="$v.$invalid"
          >Submit</b-button
        > -->

        <b-button type="submit" variant="primary"
          >Submit</b-button
        >

        $v.$invalid = {{ $v.$invalid }}

        
        
        jwt = {{ this.jwt }}
      </b-card>
    </b-form>
  </div>
</template>
<script>
import {
  required,
  maxLength,
  minLength,
  integer,
  email,
  between,
} from 'vuelidate/lib/validators'

import axios from 'axios'

export default {
  data() {
    return {
      jwt: null,
      submitStatus: null,
      firstName: null,
      lastName: null,
      email: null,
      primaryPhone: null,
      secondaryPhone: null,
      street: null,
      street2: null,
      city: null,
      state: null,
      zipcode: null,
      country: null,
      boat_year: null,
      boat_length: null,
      boat_make: null,
      boat_doc: null,
      boat_kept_at: null,
      boat_loc_city: null,
      boat_loc_state: null,
      boat_loc_country: null,
      autorenew_status: false,
      card_price: 179.0,
      trailering_price: null,
      price_total: 179.0,
      discount_totals: 0.0,
      promo_code: null,
      isHomeportFlorida: false,
      IsHomeportFloridaOptions: [
        { text: 'Yes', value: true },
        { text: 'No', value: false },
      ],
      CardSelection: 'Gold',
      TrailerOptions: {
        'Marine': { text: 'Trailer Care Marine', value: 'Marine', cost: 14.0, product_type: 'Trailer' },
        'Universal': { text: 'Trailer Care Universal', value: 'Universal', cost: 24.95, product_type: 'Trailer' },
        'None': { text: 'No Roadside Assistance', value: 'None', cost: 0.0, product_type: 'Trailer' },
      },
      TrailerSelection: 'None',
      boat_kept_at_options: [
        { value: 'marina', text: 'Marina' },
        { value: 'homedock', text: 'Home Dock' },
        { value: 'trailer', text: 'Trailer' },
        { value: 'mooring', text: 'Mooring' },
      ],
    }
  },
  validations: {
    firstName: {
      required,
    },
    lastName: {
      required,
      minLength: minLength(4),
    },
    email: {
      required,
      email,
    },
    primaryPhone: {
      required,
      integer,
      minlength: minLength(10),
      maxLength: maxLength(10),
    },
    secondaryPhone: {
      integer,
      minlength: minLength(10),
      maxLength: maxLength(10),
    },
    street: {
      required,
    },
    street2: {},
    city: {
      required,
    },
    state: {
      required,
    },
    zipcode: {
      required,
      integer,
      minLength: minLength(5),
      maxLength: maxLength(5),
    },
    country: {
      required,
    },
    boat_year: {
      required,
      maxLength: maxLength(4),
      integer,
      between: between(1900, 2021),
    },
    boat_length: {
      required,
      integer,
      maxLength: maxLength(3),
      between: between(1, 100),
    },
    boat_make: {
      required,
    },
    boat_doc: {},
    boat_kept_at: {
      required,
    },
    boat_loc_city: {
      required,
    },
    boat_loc_state: {
      required,
    },
    boat_loc_country: {
      required,
    },
  },
  computed: {
    CardOptions() {
      return {
        'Gold': { text: 'Gold Card', value: 'Gold', cost: 179.0, product_type: 'Card' },
        'Lake': {
          text: 'Lake Card',
          value: 'Lake',
          cost: 159.0,
          disabled: this.$data.isHomeportFlorida,
          product_type: 'Card'
        },
       'Commercial':
        { text: 'Commerical Card', value: 'Commercial', cost: 179.0, product_type: 'Card' },
        'ProfMariner':
        {
          text: 'Professional Mariner Card',
          value: 'ProfMariner',
          cost: 365.0,
          product_type: 'Card'
        },
      }
    },
  },
  methods: {
    async createLead() {
      var token = await this.Authenticate()

      let config = {
        headers: {
          Authorization: 'JWT ' + token,
          'Content-Type': 'application/json'
        }
      }

      let data = {
        lastname: this.lastName,
        company: 'Dealer Portal Test',
        status: 'Active',
        home_port_type__c: this.boat_kept_at,
        aor__c: 'a0d37000004fpm9AAA'
      }

      axios.post('http://127.0.0.1:5000/leads/', data, config).then((response) => {
        console.log(response)
      })
    },
    Authenticate() {
      console.log('inside of authenticate')

      //replace dynamically or set to a dealer user specifically
      let data = {
        username: 'patrick',
        password: 'abc123',
      }

      return new Promise(resolve => {
        setTimeout(() => {
          axios.post('http://127.0.0.1:5000/auth', data).then((response) => {
        this.jwt = response.data.access_token
        resolve(response.data.access_token)
      })
        }, 0);
      })
    },
    preventDisabledAndChecked(isHomeportInFlorida) {
      if (isHomeportInFlorida && this.$data.CardSelection == 'Lake') {
        document.getElementById(
          'card-selection-radio_BV_option_0'
        ).checked = true

        this.CardSelection = 'Gold'
        this.updateCartPrice('Gold')
      }
    },
    async submitForm() {
      // this.$v.$touch()
      // if (this.$v.$invalid) {
      //   console.log('error with form, prevent checkout')
      // } else {
      //   console.log('await promise')
      //   const token = this.getJWT().then(
      //     this.createLead(token)
      //   )
      //   console.log('after promise: ' + token)
      //   //if jwt != null then we can post to API
      // }
      
      this.createLead()
    },
    updateCartPrice(event) {
      var combined_dicts = Object.assign({}, this.CardOptions, this.TrailerOptions)

      if (combined_dicts[event].product_type === 'Card') {
        this.card_price = combined_dicts[event].cost
      } else if (combined_dicts[event].product_type === 'Trailer') {
        this.trailering_price = combined_dicts[event].cost
      }
      
      this.price_total = this.card_price + this.trailering_price
    },
  },
}
</script>
