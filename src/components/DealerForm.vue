<template>
  <div>
    <b-form @submit.prevent="submitSearchForm" id="dealer-form">
      <b-card bg-variant="light">
        <b-form-group
          label-cols-lg="3"
          label="Search for a membership"
          label-size="lg"
          label-class="font-weight-bold pt-0"
          class="mb-0"
        ></b-form-group>

        <b-row>
          <b-col>
            <b-input-group>
              <b-form-input
                id="membership_number__c"
                v-model="$v.membership_number__c.$model"
                placeholder="Enter an email, phone number, or membership number"
              ></b-form-input>
            </b-input-group>
          </b-col>
          <b-col>
            <b-button
              @click="toggleBusy"
              type="submit"
              variant="primary"
              :disabled="
                this.membership_number__c == null ||
                this.membership_number__c == ''
              "
              >Submit</b-button
            >
          </b-col>
        </b-row>

        <template>
          <div>
            <b-table
              :fields="tableFields"
              :items="response_data"
              :busy="isBusy"
              striped
              responsive="sm"
            >
              <template #table-busy>
                <div class="text-center text-danger my-2">
                  <b-spinner class="align-middle"></b-spinner>
                  <strong>Loading...</strong>
                </div>
              </template>
              <template #cell(show_details)="row">
                <b-button
                  size="sm"
                  @click="RenewMembership(row, row.index, row.detailsShowing)"
                  class="mr-2"
                >
                  {{ row.detailsShowing ? "Clear From Form" : "Renew Member" }}
                </b-button>
              </template>

              <!-- Make editable fields here -->
              <template #row-details="row">
                <b-card>
                  <li
                    v-for="item in response_data[row.index]['full_data'][
                      'boats'
                    ]"
                    :key="item.sfid"
                  >
                    Boat item = {{ item }}
                  </li>
                  <!-- <b-col sm="3" class="text-sm-right"><b>Boat:</b></b-col>
                  <b-col>{{ row.item.full_data.boats }}</b-col>-->
                </b-card>
                <b-card>
                  <li
                    v-for="item in response_data[row.index]['full_data'][
                      'account'
                    ]"
                    :key="item.sfid"
                  >
                    Account item = {{ item }}
                  </li>
                  <!-- <b-col sm="3" class="text-sm-right"><b>Boat:</b></b-col>
                  <b-col>{{ row.item.full_data.boats }}</b-col>-->
                </b-card>
                <b-card>
                  <li
                    v-for="item in response_data[row.index]['full_data'][
                      'contacts'
                    ]"
                    :key="item.sfid"
                  >
                    Contact item = {{ item }}
                  </li>
                  <!-- <b-col sm="3" class="text-sm-right"><b>Boat:</b></b-col>
                  <b-col>{{ row.item.full_data.boats }}</b-col>-->
                </b-card>
                <b-card>
                  <li
                    v-for="item in response_data[row.index]['full_data'][
                      'memberships'
                    ]"
                    :key="item.sfid"
                  >
                    Membership item = {{ item }}
                  </li>
                  <!-- <b-col sm="3" class="text-sm-right"><b>Boat:</b></b-col>
                  <b-col>{{ row.item.full_data.boats }}</b-col>-->
                </b-card>
                <b-card>
                  <b-button size="sm" @click="row.toggleDetails"
                    >Hide Details</b-button
                  >
                </b-card>
                <!-- Make editable fields here END -->
              </template>
            </b-table>
          </div>
        </template>
      </b-card>
    </b-form>

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
            <b-row>
              <b-col sm="4">
                <b-form-radio-group
                  id="card-selection-radio"
                  @change="UpdateCardDesc($event)"
                  v-model="CardSelection"
                  :options="CardOptions"
                  name="cardtype-radio-options"
                  stacked
                ></b-form-radio-group>
              </b-col>

              <b-col cols="8">
                <span id="carddescription">
                  {{ this.card_desc }}
                </span>
              </b-col>
            </b-row>
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

      <b-card bg-variant="light" v-if="this.autorenew_status == 'true'">
        <b-form-group
          label-cols-sm="4"
          label-cols-lg="3"
          label="Billing Information"
          label-size="lg"
          label-class="font-weight-bold pt-0"
          class="mb-0"
        >
        </b-form-group>

        <b-form-group
          label-cols-sm="2"
          label="Credit Card Number:"
          label-align-sm="left"
          label-for="promotion-code"
        >
          <b-form-input
            id="cc-number"
            v-model="$v.promotion_code.$model"
          ></b-form-input
        ></b-form-group>
        <b-form-input
          id="promotion-code"
          v-model="$v.promotion_code.$model"
        ></b-form-input>
        <b-form-input
          id="promotion-code"
          v-model="$v.promotion_code.$model"
        ></b-form-input>
        <b-form-input id="promotion-code" v-model="$v.promotion_code.$model">
        </b-form-input>
      </b-card>

      <b-card bg-variant="light">
        <b-form-group
          label-cols-sm="4"
          label-cols-lg="3"
          label="Promotion Code"
          label-size="lg"
          label-class="font-weight-bold pt-0"
          class="mb-0"
        >
          <b-form-group
            label-cols-sm="2"
            label="Promotion Code:"
            label-align-sm="left"
            label-for="promotion-code"
          >
            <b-row>
              <b-col>
                <b-form-input
                  id="promotion-code"
                  v-model="$v.promotion_code.$model"
                >
                </b-form-input>
              </b-col>
              <b-col>
                <b-button
                  :disabled="this.promotion_valid"
                  @click="submitPromo(promotion_code)"
                  type="button"
                  variant="primary"
                  >Apply</b-button
                >
                <b-button
                  :disabled="!this.promotion_valid"
                  @click="resetPromotionDetails()"
                  type="button"
                  variant="primary"
                  >Clear</b-button
                >
              </b-col>

              <b-col>
                Title: {{ this.promotion_title }} Desc:
                {{ this.promotion_desc }} | Price: {{ this.promotion_price }} |
                Code: {{ this.promotion_code }}
              </b-col>
            </b-row>
          </b-form-group>
        </b-form-group>
      </b-card>

      <b-card bg-variant="light">
        <b-form-group
          label-cols-sm="4"
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
            <b-form-input
              id="first-name"
              v-model="$v.contacts.firstname.$model"
            >
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
            <b-form-input
              id="last-name"
              size="sm"
              v-model="$v.contacts.lastname.$model"
            >
            </b-form-input>

            <span
              v-if="!$v.lastName.required && $v.lastName.$dirty"
              class="text-danger"
              >Last Name is required!
            </span>
          </b-form-group>

          <b-form-group
            label-cols-sm="2"
            label="Account Name:"
            label-align-sm="left"
            label-for="account-name"
          >
            <b-form-input id="account-name" v-model="this.accountName">
            </b-form-input>
            <span
              v-if="!$v.account_name.required && $v.account_name.$dirty"
              class="text-danger"
              >Account Name is required!
            </span>
          </b-form-group>

          <b-form-group
            label-cols-sm="2"
            label="Email:"
            label-align-sm="left"
            label-for="email"
          >
            <b-form-input
              id="email"
              v-model="$v.contacts.email.$model"
            ></b-form-input>
            <span
              v-if="!$v.contacts.email.required && $v.contacts.email.$dirty"
              class="text-danger"
              >Email is required!
            </span>

            <span v-if="!$v.contacts.email" class="text-danger"
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
              v-model="$v.contacts.phone.$model"
            ></b-form-input>
            <span
              v-if="!$v.contacts.phone.required && $v.contacts.phone.$dirty"
              class="text-danger"
              >Primary Phone is required!
            </span>

            <span
              v-if="!$v.contacts.phone.integer && $v.contacts.phone.$dirty"
              class="text-danger"
              >Phone numbers should consist of only numbers. ex: 6315664283
            </span>

            <span
              v-if="$v.contacts.phone.integer && !$v.contacts.phone.minlength && $v.contacts.phone.$dirty"
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
              v-model="$v.contacts.mobilephone.$model"
            ></b-form-input>
            <span
              v-if="!$v.contacts.mobilephone.integer && $v.contacts.mobilephone.$dirty"
              class="text-danger"
              >Phone numbers should consist of only numbers. ex: 6315664283
            </span>

            <span
              v-if="
                $v.contacts.mobilephone.integer &&
                !$v.contacts.mobilephone.minlength &&
                $v.contacts.mobilephone.$dirty
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
            <b-form-select
              v-model="$v.state.$model"
              :options="state_options"
              class="mb-3"
            >
              <template v-slot:first>
                <b-form-select-option :value="null" disabled
                  >-- Please select an option --</b-form-select-option
                >
              </template>
            </b-form-select>

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
            <b-form-select
              v-model="$v.country.$model"
              :options="country_options"
              class="mb-3"
            >
              <template v-slot:first>
                <b-form-select-option :value="null" disabled
                  >-- Please select an option --</b-form-select-option
                >
              </template>
            </b-form-select>

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
            <b-form-select
              v-model="$v.boat_loc_state.$model"
              :options="state_options"
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
              v-if="!$v.boat_loc_state.required && $v.boat_loc_state.$dirty"
              class="text-danger"
              >Boat Location State is required!
            </span>
          </b-form-group>

          <span
            v-if="!$v.boat_loc_country.required && $v.boat_loc_country.$dirty"
            class="text-danger"
            >Boat Country is required!
          </span>
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
} from "vuelidate/lib/validators";

import axios from "axios";

export default {
  data() {
    return {
      contacts: {
        firstname: null,
        lastname: null,
        email: null,
        mobilephone: null,
        phone: null,
      },
      profile_data: null,
      account_name: null,
      promotion_value_in_dollars: 0,
      promotion_type: null,
      promotion_valid_on_type: null,
      promotion_title: null,
      promotion_value_in_days: null,
      promotion_value_percentage_discount: null,
      promotion_desc: null,
      promotion_code: null,
      promotion_valid: null,
      promotion_price: "",
      jwt: null,
      submitStatus: null,
      firstName: "",
      lastName: "",
      email: null,
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
      card_desc:
        "The choice of over 95% of Sea Tow members. This card provides membership benefits for any recreational vessel that has an engine and is registered to or owned by the member (covered vessels). Any person operating a covered vessel is entitled to receive membership benefits for that vessel. The Gold Card member may also use his/her privileges on any vessel he/she charters, rents, leases or borrows. For complete details on all Gold Card member privileges please see our Membership Agreement.",
      trailering_price: null,
      price_total: 179.0,
      promo_code: null,
      isHomeportFlorida: false,
      IsHomeportFloridaOptions: [
        { text: "Yes", value: true },
        { text: "No", value: false },
      ],
      CardSelection: "Gold",
      TrailerOptions: [
        { text: "Trailer Care Marine", value: "Marine", cost: 14.0 },
        { text: "Trailer Care Universal", value: "Universal", cost: 24.95 },
        { text: "No Roadside Assistance", value: "None", cost: 0.0 },
      ],
      TrailerSelection: "None",
      boat_kept_at_options: [
        { value: "marina", text: "Marina" },
        { value: "homedock", text: "Home Dock" },
        { value: "trailer", text: "Trailer" },
        { value: "mooring", text: "Mooring" },
      ],
      country_options: [
        { value: "US", text: "United States" },
        { value: "CA", text: "Canada" },
      ],
      state_options: [
        {
          value: "Alabama",
          text: "AL",
        },
        {
          value: "Alaska",
          text: "AK",
        },
        {
          value: "American Samoa",
          text: "AS",
        },
        {
          value: "Arizona",
          text: "AZ",
        },
        {
          value: "Arkansas",
          text: "AR",
        },
        {
          value: "California",
          text: "CA",
        },
        {
          value: "Colorado",
          text: "CO",
        },
        {
          value: "Connecticut",
          text: "CT",
        },
        {
          value: "Delaware",
          text: "DE",
        },
        {
          value: "District Of Columbia",
          text: "DC",
        },
        {
          value: "Federated States Of Micronesia",
          text: "FM",
        },
        {
          value: "Florida",
          text: "FL",
        },
        {
          value: "Georgia",
          text: "GA",
        },
        {
          value: "Guam",
          text: "GU",
        },
        {
          value: "Hawaii",
          text: "HI",
        },
        {
          value: "Idaho",
          text: "ID",
        },
        {
          value: "Illinois",
          text: "IL",
        },
        {
          value: "Indiana",
          text: "IN",
        },
        {
          value: "Iowa",
          text: "IA",
        },
        {
          value: "Kansas",
          text: "KS",
        },
        {
          value: "Kentucky",
          text: "KY",
        },
        {
          value: "Louisiana",
          text: "LA",
        },
        {
          value: "Maine",
          text: "ME",
        },
        {
          value: "Marshall Islands",
          text: "MH",
        },
        {
          value: "Maryland",
          text: "MD",
        },
        {
          value: "Massachusetts",
          text: "MA",
        },
        {
          value: "Michigan",
          text: "MI",
        },
        {
          value: "Minnesota",
          text: "MN",
        },
        {
          value: "Mississippi",
          text: "MS",
        },
        {
          value: "Missouri",
          text: "MO",
        },
        {
          value: "Montana",
          text: "MT",
        },
        {
          value: "Nebraska",
          text: "NE",
        },
        {
          value: "Nevada",
          text: "NV",
        },
        {
          value: "New Hampshire",
          text: "NH",
        },
        {
          value: "New Jersey",
          text: "NJ",
        },
        {
          value: "New Mexico",
          text: "NM",
        },
        {
          value: "New York",
          text: "NY",
        },
        {
          value: "North Carolina",
          text: "NC",
        },
        {
          value: "North Dakota",
          text: "ND",
        },
        {
          value: "Northern Mariana Islands",
          text: "MP",
        },
        {
          value: "Ohio",
          text: "OH",
        },
        {
          value: "Oklahoma",
          text: "OK",
        },
        {
          value: "Oregon",
          text: "OR",
        },
        {
          value: "Palau",
          text: "PW",
        },
        {
          value: "Pennsylvania",
          text: "PA",
        },
        {
          value: "Puerto Rico",
          text: "PR",
        },
        {
          value: "Rhode Island",
          text: "RI",
        },
        {
          value: "South Carolina",
          text: "SC",
        },
        {
          value: "South Dakota",
          text: "SD",
        },
        {
          value: "Tennessee",
          text: "TN",
        },
        {
          value: "Texas",
          text: "TX",
        },
        {
          value: "Utah",
          text: "UT",
        },
        {
          value: "Vermont",
          text: "VT",
        },
        {
          value: "Virgin Islands",
          text: "VI",
        },
        {
          value: "Virginia",
          text: "VA",
        },
        {
          value: "Washington",
          text: "WA",
        },
        {
          value: "West Virginia",
          text: "WV",
        },
        {
          value: "Wisconsin",
          text: "WI",
        },
        {
          value: "Wyoming",
          text: "WY",
        },
      ],
      membership_number__c: "42069",
      renewToggle: false,
      search_type: null,
      response_data: [],
      full_data: [],
      isBusy: false,
      tableFields: [
        {
          label: "Membership Number",
          key: "membership_number__c",
          sortable: true,
        },
        {
          label: "First Name",
          key: "firstname",
          sortable: false,
        },
        {
          label: "Last Name",
          key: "lastname",
          sortable: false,
        },
        {
          label: "Phone Number",
          key: "phone",
          sortable: false,
        },
        {
          label: "Mobile Phone Number",
          key: "mobilephone",
          sortable: false,
        },
        {
          label: "Email",
          key: "email",
          sortable: false,
        },
        {
          label: "Renew Membership",
          key: "show_details",
          sortable: false,
        },
      ],
    };
  },
  validations: {
    contacts: {
      firstname: {
        required,
      },
      lastname: {
        required,
      },
      email: {
        required,
        email,
      },
      mobilephone: {
        integer,
        minlength: minLength(10),
        maxLength: maxLength(10),
      },
      phone: {
        required,
        integer,
        minlength: minLength(10),
        maxLength: maxLength(10)
      }
    },
    membership_number__c: {
      required,
      integer,
    },
    account_name: {
      required,
    },
    firstName: {
      required,
    },
    promotion_code: {
      minLength: minLength(3),
    },
    lastName: {
      required,
      minLength: minLength(4),
    },
    phone: {
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
    accountName: {
      get: function () {
        return this.contacts.firstname + " " + this.contacts.lastname;
      },
      // setter
      set: function () {
        this.account_name =
          this.contacts.firstName + " " + this.contacts.lastName;
      },
    },
    CardOptions() {
      return [
        {
          text: "Gold Card",
          value: "Gold",
          cost: 179.0,
          title:
            "The choice of over 95% of Sea Tow members. This card provides membership benefits for any recreational vessel that has an engine and is registered to or owned by the member (covered vessels). Any person operating a covered vessel is entitled to receive membership benefits for that vessel. The Gold Card member may also use his/her privileges on any vessel he/she charters, rents, leases or borrows. For complete details on all Gold Card member privileges please see our Membership Agreement.",
        },
        {
          text: "Lake Card",
          value: "Lake",
          cost: 159.0,
          disabled: this.$data.isHomeportFlorida,
          title:
            "If you boat on fresh, non-tidal, inland waterways (excluding Florida) then the Lake Card may be the perfect option for you. The Sea Tow Lake Card provides the same member benefits as the Gold Card, but on ALL fresh, non-tidal, inland waterways. For complete details on all Lake Card member privileges please see our Membership Agreement.",
        },
        {
          text: "Commerical Card",
          value: "Commercial",
          cost: 179.0,
          title:
            "This card provides service for commercial vessels. The Commercial Card covers the primary vessel only. Any person operating the primary vessel is entitled to receive all membership benefits for that vessel at $100 per hour.",
        },
        {
          text: "Professional Mariner Card",
          value: "ProfMariner",
          cost: 365.0,
          title:
            "If you make your living on the water, this card is for you. The Professional Mariner Card is a service package for individuals who regularly use multiple vessels in the performance of their maritime duties such as: yacht delivery captains, on-water instructors, etc. Any vessel the member is operating and is the master of, is entitled to receive membership benefits for that vessel, except Dock-to-Dock Tows.",
        },
        {
          text: "Trial Gold Card (temporarily disabled)",
          value: "TrialGold",
          disabled: true,
          cost: 0.0,
          title:
            "The choice of over 95% of Sea Tow members. This card provides membership benefits for any recreational vessel that has an engine and is registered to or owned by the member (covered vessels). Any person operating a covered vessel is entitled to receive membership benefits for that vessel. The Gold Card member may also use his/her privileges on any vessel he/she charters, rents, leases or borrows. For complete details on all Gold Card member privileges please see our Membership Agreement.",
        },
        {
          text: "Trial Lake Card (temporarily disabled)",
          value: "TrialLake",
          disabled: true,
          cost: 0.0,
          title:
            "The choice of over 95% of Sea Tow members. This card provides membership benefits for any recreational vessel that has an engine and is registered to or owned by the member (covered vessels). Any person operating a covered vessel is entitled to receive membership benefits for that vessel. The Gold Card member may also use his/her privileges on any vessel he/she charters, rents, leases or borrows. For complete details on all Gold Card member privileges please see our Membership Agreement.",
        },
      ];
    },
  },
  methods: {
    async submitSearchForm() {
      let data = {
        search_term: this.membership_number__c,
        search_type: this.search_type,
      };

      axios
        .post("http://127.0.0.1:5000/utility/search/", data)
        .then((response) => {
          response["data"].forEach(
            (element) => (
              (element["show_details"] = false), console.log(element)
            )
          );
          this.toggleBusy();
          this.response_data = response["data"];
        });
    },
    toggleBusy() {
      this.isBusy = !this.isBusy;
    },
    RenewMembership(row, index, detailsShowing) {
      if (!detailsShowing) {
        let data = {
          accountid: this.response_data[index]["account__c"],
        };

        console.log(this.response_data[index]);

        axios
          .post("http://127.0.0.1:5000/utility/getallinfo/", data)
          .then((response) => {
            this.response_data[index]["full_data"] = response["data"];
          })
          .then(() => {
            var parsedobj = JSON.parse(JSON.stringify(this.contacts));
            var keynames = Object.keys(parsedobj);
            keynames.forEach((name) => {
              console.log(name);
              this.contacts[name] = this.response_data[index]["full_data"][
                "contacts"
              ][index][name];
            });

            //pass to dealer portal\
            this.detailsShowing = false;
          });
      } else {
        //clear form+table
        this.detailsShowing = false;
      }
    },
    ExpandAndShowData(row, index, detailsShowing) {
      if (!detailsShowing) {
        let data = {
          accountid: this.response_data[index]["account__c"],
        };

        console.log(this.response_data[index]);

        axios
          .post("http://127.0.0.1:5000/utility/getallinfo/", data)
          .then((response) => {
            this.response_data[index]["full_data"] = response["data"];
          })
          .then(() => {
            row.toggleDetails();
          });
      } else {
        row.toggleDetails();
      }
    },
    createLead(token) {
      console.log("Starting Create lead");

      let data = {
        headers: {
          Authorization: "JWT " + token,
        },
        lastname: this.lastName,
        company: "Dealer Portal Test",
        status: "Active",
        home_port_type__c: this.boat_kept_at,
      };

      axios.post("http://127.0.0.1:5000/leads/", data).then((response) => {
        console.log(response);
      });
    },
    calculatePrice() {},
    getJWT() {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve("Calling Authenticate");
          this.Authenticate();
        }, 500);
      });
    },
    async Authenticate() {
      //replace dynamically or set to a dealer user specifically
      let data = {
        username: "patrick",
        password: "abc123",
      };

      axios.post("http://127.0.0.1:5000/auth", data).then((response) => {
        console.log(response);
        this.access_token = response.data.access_token;
        return response.data.access_token;
      });
    },
    preventDisabledAndChecked(isHomeportInFlorida) {
      if (isHomeportInFlorida && this.$data.CardSelection == "Lake") {
        document.getElementById(
          "card-selection-radio_BV_option_0"
        ).checked = true;

        document.getElementById(
          "carddescription"
        ).innerHTML = this.CardOptions[0].title;

        this.CardSelection = "Gold";
        this.updateCartPrice("Gold");
      }
    },
    async submitPromo(promotion) {
      axios
        .post("http://127.0.0.1:5000/utility/promos/", {
          promotion_code: promotion,
        })
        .then(
          (response) => {
            if (response.data != null) {
              if (
                response.data["Error"] !=
                "The promotion code is no longer active."
              ) {
                console.log(response.data);
                this.promotion_valid = true;
                this.promotion_value_in_days =
                  response.data["value_time_in_days__c"];
                this.promotion_price =
                  response.data["value_discount_in_dollars__c"];
                this.promotion_type = response.data["promotion_type__c"];
                this.promotion_desc = response.data["promotion_details__c"];
                this.promotion_title = response.data["title__c"];
                this.updateCartPrice();
              } else {
                console.log(
                  "Set a value so that we can display an error to the user."
                );
              }
            }
          },
          (error) => {
            console.log(error);
          }
        );
    },
    resetPromotionDetails() {
      this.promotion_valid = false;
      this.promotion_price = 0;
      this.promotion_type__c = null;
      this.title__c = null;
      this.promotion_value_in_dollars = null;
      this.promotion_value_in_days = null;
      this.promotion_code = null;
      this.promotion_details__c = null;
      this.promotion_desc = null;
    },
    async submitForm() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        console.log("error with form, prevent checkout");
      } else {
        console.log("await promise");
        const token = await this.getJWT();
        console.log("after promise: " + token);
        //if jwt != null then we can post to API
        if (token != null) {
          this.createLead(token);
        }
      }
    },
    GetCardDesc(cardName) {
      var co = this.CardOptions;
      var i = 0;
      for (i = 0; i < co.length; i++) {
        if (cardName == co[i].value) {
          console.log(co[i]);
          this.card_desc = co[i].title;
        }
      }
    },
    UpdateCardDesc(event) {
      console.log(event);
      this.GetCardDesc(event);
      document.getElementById("carddescription").innerHTML = this.card_desc;
      this.updateCartPrice(event);
    },
    updateCartPrice(event) {
      var co = this.CardOptions;
      var to = this.TrailerOptions;
      var i;

      for (i = 0; i < co.length; i++) {
        if (event == co[i].value) {
          this.card_price = co[i].cost;
        }
      }

      for (i = 0; i < to.length; i++) {
        if (event == to[i].value) {
          this.trailering_price = to[i].cost;
        }
      }

      this.price_total = this.calculateCartPrice();
    },
    calculateCartPrice() {
      if (this.promotion_code != null) {
        console.log(this.promotion_type);
        if (this.promotion_type == "Dollar Discount") {
          return this.price_total - this.promotion_value_in_dollars;
        }

        if (this.promotion_type == "Percentage Discount") {
          return this.price_total * this.promotion_value_percentage_discount;
        }

        // if (this.promotion_type == 'Additional Trial Time') {
        //   return this.price
        // }

        return this.price_total;
      }
    },
  },
};
</script>
