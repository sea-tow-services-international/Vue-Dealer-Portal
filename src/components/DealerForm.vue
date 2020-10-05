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
          <div class="card-form">
            <div class="card-list">
              <VuePaycard :valueFields="valueFields" />
              <div class="card-form__inner">
                <div class="card-input">
                  <label for="cardNumber" class="card-input__label"
                    >Card Number</label
                  >
                  <input
                    v-model="valueFields.cardNumber"
                    title="Number"
                    class="card-input__input"
                    @input="changeNumber($event)"
                    data-card-field
                    autocomplete="off"
                    :maxlength="cardNumberMaxLength"
                  />
                </div>
                <div class="card-input">
                  <label for="cardName" class="card-input__label"
                    >Card Holder</label
                  >
                  <input
                    type="text"
                    title="Name"
                    v-letter-only
                    class="card-input__input"
                    v-model="valueFields.cardName"
                    @input="this.changeName($event)"
                    data-card-field
                    autocomplete="off"
                  />
                </div>
                <div class="card-form__row">
                  <div class="card-form__col">
                    <div class="card-form__group">
                      <label
                        for="cardMonth"
                        class="card-input__label"
                        aria-label="Expiration Date"
                        >Expiration Date</label
                      >
                      <select
                        class="card-input__input -select"
                        v-model="valueFields.cardMonth"
                        aria-label="Card Month"
                        title="Month"
                        data-card-field
                      >
                        <option value disabled selected>Month</option>
                        <option
                          v-bind:value="n < 10 ? '0' + n : n"
                          v-for="n in 12"
                          v-bind:disabled="n < minCardMonth"
                          v-bind:key="n"
                          >{{ generateMonthValue }}</option
                          
                        >
                      </select>
                      <select
                        class="card-input__input -select"
                        aria-label="Card year"
                        title="Year"
                        v-model="valueFields.cardYear"
                        data-card-field
                      >
                        <option value disabled selected>Year</option>
                        <option
                          v-bind:value="$index + minCardYear"
                          v-for="(n, $index) in 12"
                          v-bind:key="n"
                          >{{ $index + minCardYear }}</option
                        >
                      </select>
                    </div>
                  </div>
                  <div class="card-form__col -cvv">
                    <div class="card-input">
                      <label
                        for="cardCvv"
                        class="card-input__label"
                        aria-label="Card CVV"
                        >CVV</label
                      >
                      <input
                        type="tel"
                        title="CVV"
                        class="card-input__input"
                        v-number-only
                        maxlength="4"
                        v-model="valueFields.cardCvv"
                        @input="changeCvv"
                        data-card-field
                        autocomplete="off"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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

            <span
              v-if="!$v.firstName.alpha && $v.firstName.$dirty"
              class="text-danger"
              >First Name must not contain numbers!
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

            <span
              v-if="!$v.lastName.alpha && $v.lastName.$dirty"
              class="text-danger"
              >Last Name must not contain numbers!
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
              >Sea Tow generally does not accept boats of size 100' or greater.
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

        <b-button type="submit" variant="primary">Submit</b-button>
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
  alpha,
  alphaNum,
  between,
} from 'vuelidate/lib/validators'

export default {
  data() {
    return {
      minCardYear: new Date().getFullYear(),
      mainCardNumber: '',
      cardNumberMaxLength: 19,
      valueFields: {
        cardName: '',
        cardNumber: '',
        cardMonth: null,
        cardYear: null,
        cardCvv: null,
      },
      inputFields: {
        cardNumber: 'v-card-number',
        cardName: 'v-card-name',
        cardMonth: 'v-card-month',
        cardYear: 'v-card-year',
        cardCvv: 'v-card-cvv',
      },
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
      TrailerOptions: [
        { text: 'Trailer Care Marine', value: 'Marine', cost: 14.0 },
        { text: 'Trailer Care Universal', value: 'Universal', cost: 24.95 },
        { text: 'No Roadside Assistance', value: 'None', cost: 0.0 },
      ],
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
      alpha,
    },
    lastName: {
      required,
      alpha,
      minLength: minLength(4),
    },
    email: {
      required,
      email,
    },
    primaryPhone: {
      required,
      integer,
      minlength: minLength(9),
    },
    secondaryPhone: {
      integer,
      minlength: minLength(9),
    },
    street: {
      required,
      alphaNum,
    },
    street2: {
      alphaNum,
    },
    city: {
      required,
      alphaNum,
    },
    state: {
      required,
    },
    zipcode: {
      required,
      integer,
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
      alpha,
    },
    boat_doc: {
      alphaNum,
    },
    boat_kept_at: {
      required,
    },
    boat_loc_city: {
      required,
      alpha,
    },
    boat_loc_state: {
      required,
    },
    boat_loc_country: {
      required,
    },
  },
  directives: {
    'number-only': {
      bind(el) {
        function checkValue(event) {
          event.target.value = event.target.value.replace(/[^0-9]/g, '')
          if (event.charCode >= 48 && event.charCode <= 57) {
            return true
          }
          event.preventDefault()
        }
        el.addEventListener('keypress', checkValue)
      },
    },
    'letter-only': {
      bind(el) {
        function checkValue(event) {
          if (event.charCode >= 48 && event.charCode <= 57) {
            event.preventDefault()
          }
          return true
        }
        el.addEventListener('keypress', checkValue)
      },
    },
  },
  computed: {
    minCardMonth() {
      if (this.valueFields.cardYear === this.minCardYear)
        return new Date().getMonth() + 1
      return 1
    },
    CardOptions() {
      return [
        { text: 'Gold Card', value: 'Gold', cost: 179.0 },
        {
          text: 'Lake Card',
          value: 'Lake',
          cost: 159.0,
          disabled: this.$data.isHomeportFlorida,
        },
        { text: 'Commerical Card', value: 'Commercial', cost: 179.0 },
        {
          text: 'Professional Mariner Card',
          value: 'ProfMariner',
          cost: 365.0,
        },
      ]
    },
  },
  watch: {
    cardYear() {
      if (this.valueFields.cardMonth < this.minCardMonth) {
        this.valueFields.cardMonth = ''
      }
    },
  },
  methods: {
    preventDisabledAndChecked(isHomeportInFlorida) {
      if (isHomeportInFlorida && this.$data.CardSelection == 'Lake') {
        document.getElementById(
          'card-selection-radio_BV_option_0'
        ).checked = true

        this.CardSelection = 'Gold'
        this.updateCartPrice('Gold')
      }
    },
    submitForm() {
      this.$v.$touch()
    },
    updateCartPrice(event) {
      var co = this.CardOptions
      var to = this.TrailerOptions
      var i

      for (i = 0; i < co.length; i++) {
        if (event == co[i].value) {
          this.card_price = co[i].cost
        }
      }

      for (i = 0; i < to.length; i++) {
        if (event == to[i].value) {
          this.trailering_price = to[i].cost
        }
      }

      this.price_total = this.card_price + this.trailering_price
    },
  },
  changeName(e) {
    this.valueFields.cardName = e.target.value
    this.$emit('input-card-name', this.valueFields.cardName)
  },
  changeNumber(e) {
    this.valueFields.cardNumber = e.target.value
    const value = this.valueFields.cardNumber.replace(/\D/g, '')
    // american express, 15 digits
    if (/^3[47]\d{0,13}$/.test(value)) {
      this.valueFields.cardNumber = value
        .replace(/(\d{4})/, '$1 ')
        .replace(/(\d{4}) (\d{6})/, '$1 $2 ')
      this.cardNumberMaxLength = 17
    } else if (/^3(?:0[0-5]|[68]\d)\d{0,11}$/.test(value)) {
      // diner's club, 14 digits
      this.valueFields.cardNumber = value
        .replace(/(\d{4})/, '$1 ')
        .replace(/(\d{4}) (\d{6})/, '$1 $2 ')
      this.cardNumberMaxLength = 16
    } else if (/^\d{0,16}$/.test(value)) {
      // regular cc number, 16 digits
      this.valueFields.cardNumber = value
        .replace(/(\d{4})/, '$1 ')
        .replace(/(\d{4}) (\d{4})/, '$1 $2 ')
        .replace(/(\d{4}) (\d{4}) (\d{4})/, '$1 $2 $3 ')
      this.cardNumberMaxLength = 19
    }
    // eslint-disable-next-line
    if (e.inputType == 'deleteContentBackward') {
      const lastChar = this.valueFields.cardNumber.substring(
        this.valueFields.cardNumber.length,
        this.valueFields.cardNumber.length - 1
      )
      // eslint-disable-next-line
      if (lastChar == ' ') {
        this.valueFields.cardNumber = this.valueFields.cardNumber.substring(
          0,
          this.valueFields.cardNumber.length - 1
        )
      }
    }
    this.$emit('input-card-number', this.valueFields.cardNumber)
  },
  changeMonth() {
    this.$emit('input-card-month', this.valueFields.cardMonth)
  },
  changeYear() {
    this.$emit('input-card-year', this.valueFields.cardYear)
  },
  changeCvv(e) {
    this.valueFields.cardCvv = e.target.value
    this.$emit('input-card-cvv', this.valueFields.cardCvv)
  },
  generateMonthValue(n) {
    return n < 10 ? `0${n}` : n
  },
  toggleMask() {
    this.isCardNumberMasked = !this.isCardNumberMasked
    if (this.isCardNumberMasked) {
      this.maskCardNumber()
    } else {
      this.unMaskCardNumber()
    }
  },
  maskCardNumber() {
    this.valueFields.cardNumberNotMask = this.valueFields.cardNumber
    this.mainCardNumber = this.valueFields.cardNumber
    const arr = this.valueFields.cardNumber.split('')
    arr.forEach((element, index) => {
      if (index > 4 && index < 14 && element.trim() !== '') {
        arr[index] = '*'
      }
    })
    this.valueFields.cardNumber = arr.join('')
  },
  unMaskCardNumber() {
    this.valueFields.cardNumber = this.mainCardNumber
  },
}
</script>
