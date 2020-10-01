<template>
  <div>
    <b-form @submit.prevent="submitForm">
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

          <b-form-group label="Select Membership Type">
            <b-form-radio-group
              id="card-selection-radio"
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
                  label-cols-sm="3"
                  label="Last Name:"
                  label-align-sm="right"
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
              </b-col>
            </b-row>

            <b-form-group
              label-cols-sm="3"
              label="Email:"
              label-align-sm="right"
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
              label-cols-sm="3"
              label="Primary Phone:"
              label-align-sm="right"
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
              label-cols-sm="3"
              label="Secondary Phone:"
              label-align-sm="right"
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
              label-cols-sm="3"
              label="Year:"
              label-align-sm="right"
              label-for="nested-boat"
            >
              <b-form-input id="nested-boat"></b-form-input>
            </b-form-group>

            <b-form-group
              label-cols-sm="3"
              label="Length:"
              label-align-sm="right"
              label-for="nested-length"
            >
              <b-form-input id="nested-length"></b-form-input>
            </b-form-group>

            <b-form-group
              label-cols-sm="3"
              label="Make:"
              label-align-sm="right"
              label-for="nested-make"
            >
              <b-form-input id="nested-make"></b-form-input>
            </b-form-group>

            <b-form-group
              label-cols-sm="3"
              label="Registration/Document Number:"
              label-align-sm="right"
              label-for="nested-doc-num"
            >
              <b-form-input id="nested-doc-num"></b-form-input>
            </b-form-group>

            <b-form-group
              label-cols-sm="3"
              label="Boat is kept at:"
              label-align-sm="right"
            >
              <b-dropdown id="dropdown-header" text="Dropdown" class="m-2">
                <b-dropdown-header id="dropdown-header-label">
                  Boat is kept at:
                </b-dropdown-header>
                <b-dropdown-item-button
                  aria-describedby="dropdown-header-label"
                >
                  Marina
                </b-dropdown-item-button>
                <b-dropdown-item-button
                  aria-describedby="dropdown-header-label"
                >
                  Home Dock
                </b-dropdown-item-button>
                <b-dropdown-item-button
                  aria-describedby="dropdown-header-label"
                >
                  Trailer
                </b-dropdown-item-button>
                <b-dropdown-item-button
                  aria-describedby="dropdown-header-label"
                >
                  Mooring
                </b-dropdown-item-button>
                <b-dropdown-item-button
                  aria-describedby="dropdown-header-label"
                >
                  Other
                </b-dropdown-item-button>
              </b-dropdown>
            </b-form-group>

            <b-form-group
              label-cols-sm="3"
              label="Boat Location City:"
              label-align-sm="right"
              label-for="nested-boat-city"
            >
              <b-form-input id="nested-boat-city"></b-form-input>
            </b-form-group>

            <b-form-group
              label-cols-sm="3"
              label="Boat Location State:"
              label-align-sm="right"
              label-for="nested-boat-state"
            >
              <b-form-input id="nested-boat-state"></b-form-input>
            </b-form-group>

            <b-form-group
              label-cols-sm="3"
              label="Boat Location Country:"
              label-align-sm="right"
              label-for="nested-country"
            >
              <b-form-input id="nested-boat-country"></b-form-input>
            </b-form-group>
          </b-form-group>

          <label for="by continuing">
            By continuing, the user verifies that their boats are in good
            working order and understand that Dock-to-Dock tows from the
            boat’s home port to a repair facility, a ramp for haul out or
            similar, are not covered for the first 30 days after membership
            activation.</label
          >
        </b-card>
      </div>
      <b-button type="submit" variant="primary">Submit</b-button>
    </b-form>
  </div>
</template>
<script>
import {
  required,
  minLength,
  integer,
  email,
  alpha,
} from 'vuelidate/lib/validators'

export default {
  data() {
    return {
      firstName: null,
      lastName: null,
      email: null,
      primaryPhone: null,
      secondaryPhone: null,
      autorenew_status: false,
      isHomeportFlorida: false,
      IsHomeportFloridaOptions: [
        { text: 'Yes', value: true },
        { text: 'No', value: false },
      ],
      CardSelection: 'Gold',
      TrailerOptions: [
        { text: 'Trailer Care Marine', value: 'marine' },
        { text: 'Trailer Care Universal', value: 'universal' },
        { text: 'No Roadside Assistance', value: 'none' },
      ],
      TrailerSelection: 'none',
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
  },
  computed: {
    CardPrices() {
      return [179.0, 119.0, 179.0, 179.0]
    },
    CardOptions() {
      return [
        { text: 'Gold Card', value: 'Gold' },
        {
          text: 'Lake Card',
          value: 'Lake',
          disabled: this.$data.isHomeportFlorida,
        },
        { text: 'Commerical Card', value: 'Commercial' },
        { text: 'Professional Mariner Card', value: 'ProfMariner' },
      ]
    },
  },
  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name]
      return $dirty ? !$error : null
    },
    preventDisabledAndChecked(isHomeportInFlorida) {
      if (isHomeportInFlorida && this.$data.CardSelection == 'Lake') {
        document.getElementById(
          'card-selection-radio_BV_option_0'
        ).checked = true
      }
    },
    submitForm() {
      this.$v.$touch()
    },
  },
}
</script>
