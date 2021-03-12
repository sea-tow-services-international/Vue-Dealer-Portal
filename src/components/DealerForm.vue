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
            <b-button-toolbar>
              <div class="mb-2">
                <b-button-group class="mx-1">
                  <b-button
                    @click="toggleBusy"
                    type="submit"
                    variant="primary"
                    :disabled="
                      this.membership_number__c == null ||
                        this.membership_number__c == ''
                    "
                    >Submit</b-button
                  ></b-button-group
                >

                <b-button-group class="mx-1">
                  <b-button
                    @click="clearForm"
                    type="submit"
                    variant="primary"
                    :disabled="!this.isRenew"
                    >Clear Form</b-button
                  >
                </b-button-group>
              </div>
            </b-button-toolbar>
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
                  {{ row.detailsShowing ? 'Clear From Form' : 'Renew Member' }}
                </b-button>
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
            label="Promotion Code:"
            label-for="promotion-code"
            :state="promotionstate"
            :invalid-feedback="promotionFeedback"
            valid-feedback="Promotion code successfully applied"
          >
            <b-row>
              <b-col>
                <b-form-input
                  id="promotion-code"
                  v-model="$v.promotion_code.$model"
                  :state="promotionstate"
                  trim
                >
                </b-form-input>
              </b-col>
              <b-col>
                <b-button-toolbar>
                  <div class="mb-2">
                    <b-button-group class="mx-1">
                      <b-button
                        :disabled="
                          this.promotion_valid &&
                            !this.promotion_code.length <= 1
                        "
                        @click="submitPromo(promotion_code)"
                        type="button"
                        variant="primary"
                        >Apply</b-button
                      ></b-button-group
                    >

                    <b-button-group class="mx-1">
                      <b-button
                        @click="resetPromotionDetails()"
                        type="button"
                        variant="primary"
                        >Clear</b-button
                      >
                    </b-button-group>
                  </div>
                </b-button-toolbar>
              </b-col>
            </b-row>
          </b-form-group>
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
          <b-form-row>
            <b-col>
              <b-form-group label="First Name:" label-for="first-name">
                <b-form-input
                  id="first-name"
                  v-model="$v.contacts.firstname.$model"
                >
                </b-form-input>
                <span
                  v-if="
                    !$v.contacts.firstname.required &&
                      $v.contacts.firstname.$dirty
                  "
                  class="text-danger"
                  >First Name is required!
                </span>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group label="Last Name:" label-for="last-name">
                <b-form-input
                  id="last-name"
                  v-model="$v.contacts.lastname.$model"
                >
                </b-form-input>

                <span
                  v-if="
                    !$v.contacts.lastname.required &&
                      $v.contacts.lastname.$dirty
                  "
                  class="text-danger"
                  >Last Name is required!
                </span>
              </b-form-group>
            </b-col>
          </b-form-row>

          <b-form-group label="Account Name:" label-for="account-name">
            <b-form-input id="account-name" v-model="this.account_name">
            </b-form-input>
          </b-form-group>

          <b-form-group label="Email:" label-for="email">
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

          <b-form-row>
            <b-col>
              <b-form-group label="Primary Phone:" label-for="primary-phone">
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
                  v-if="
                    $v.contacts.phone.integer &&
                      !$v.contacts.phone.minlength &&
                      $v.contacts.phone.$dirty
                  "
                  class="text-danger"
                  >Phone numbers must be at least 9 digits long.
                </span>
              </b-form-group>
            </b-col>

            <b-col>
              <b-form-group
                label="Secondary Phone:"
                label-for="secondary-phone"
              >
                <b-form-input
                  id="secondary-phone"
                  v-model="$v.contacts.mobilephone.$model"
                ></b-form-input>
                <span
                  v-if="
                    !$v.contacts.mobilephone.integer &&
                      $v.contacts.mobilephone.$dirty
                  "
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
            </b-col>
          </b-form-row>
        </b-form-group>
      </b-card>

      <b-card bg-variant="light">
        <b-form-group
          label-cols-lg="3"
          label="Billing Address"
          label-size="lg"
          label-class="font-weight-bold pt-0"
          class="mb-0"
        >
          <b-form-group label="Zipcode:" label-for="nested-postal">
            <b-form-input
              id="nested-postal"
              v-model="$v.account.billingpostalcode.$model"
            ></b-form-input>
            <span
              v-if="
                !$v.account.billingpostalcode.required &&
                  $v.account.billingpostalcode.$dirty
              "
              class="text-danger"
              >Zipcode is required!
            </span>
          </b-form-group>
          <b-form-row>
            <b-col>
              <b-form-group label="Street:" label-for="nested-street">
                <b-form-input
                  id="nested-street"
                  v-model="$v.account.billingstreet.$model"
                ></b-form-input>
                <span
                  v-if="
                    !$v.account.billingstreet.required &&
                      $v.account.billingstreet.$dirty
                  "
                  class="text-danger"
                  >Street is required!
                </span>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group label="City:" label-for="nested-city">
                <b-form-input
                  id="nested-city"
                  v-model="$v.account.billingcity.$model"
                ></b-form-input>
                <span
                  v-if="
                    !$v.account.billingcity.required &&
                      $v.account.billingcity.$dirty
                  "
                  class="text-danger"
                  >City is required!
                </span>
              </b-form-group>
            </b-col>
            <b-col cols="4">
              <b-form-group label="State:" label-for="nested-state">
                <b-form-select
                  v-model="$v.account.billingstate.$model"
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
                  v-if="
                    !$v.account.billingstate.required &&
                      $v.account.billingstate.$dirty
                  "
                  class="text-danger"
                  >State is required!
                </span>
              </b-form-group>
            </b-col>
          </b-form-row>

          <b-form-group label="Country:" label-for="nested-country">
            <b-form-select
              v-model="$v.account.billingcountry.$model"
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
              v-if="
                !$v.account.billingcountry.required &&
                  $v.account.billingcountry.$dirty
              "
              class="text-danger"
              >Country is required!
            </span>
          </b-form-group>

          <b-form-checkbox
            id="shipping_same_as_billing"
            v-model="shipping_same_as_billing"
            name="shipping_same_as_billing-checkbox"
            value="true"
            unchecked-value="false"
          >
            Shipping Same As Billing
          </b-form-checkbox>
        </b-form-group>
      </b-card>

      <b-card
        bg-variant="light"
        v-if="
          this.shipping_same_as_billing == 'false' ||
            this.shipping_same_as_billing == false
        "
      >
        <b-form-group
          label-cols-lg="3"
          label="Shipping Address"
          label-size="lg"
          label-class="font-weight-bold pt-0"
          class="mb-0"
        >
          <b-form-group label="Street:" label-for="nested-street">
            <b-form-input
              id="nested-street"
              v-model="$v.account.shippingstreet.$model"
            ></b-form-input>
            <span
              v-if="
                !$v.account.shippingstreet.required &&
                  $v.account.shippingstreet.$dirty
              "
              class="text-danger"
              >Street is required!
            </span>
          </b-form-group>

          <b-form-group label="City:" label-for="nested-city">
            <b-form-input
              id="nested-city"
              v-model="$v.account.shippingcity.$model"
            ></b-form-input>
            <span
              v-if="
                !$v.account.shippingcity.required &&
                  $v.account.shippingcity.$dirty
              "
              class="text-danger"
              >City is required!
            </span>
          </b-form-group>

          <b-form-group label="State:" label-for="nested-state">
            <b-form-select
              v-model="$v.account.shippingstate.$model"
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
              v-if="
                !$v.account.shippingstate.required &&
                  $v.account.shippingstate.$dirty
              "
              class="text-danger"
              >State is required!
            </span>
          </b-form-group>

          <b-form-group label="Zipcode:" label-for="nested-postal">
            <b-form-input
              id="nested-postal"
              v-model="$v.account.shippingpostalcode.$model"
            ></b-form-input>
            <span
              v-if="
                !$v.account.shippingpostalcode.required &&
                  $v.account.shippingpostalcode.$dirty
              "
              class="text-danger"
              >Zipcode is required!
            </span>
          </b-form-group>

          <b-form-group label="Country:" label-for="nested-country">
            <b-form-select
              v-model="$v.account.shippingcountry.$model"
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
              v-if="
                !$v.account.shippingcountry.required &&
                  $v.account.shippingcountry.$dirty
              "
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
          <b-form-row>
            <b-col>
              <b-form-group label="Boat Year:" label-for="nested-year">
                <b-form-input
                  id="nested-year"
                  v-model="$v.boats.year__c.$model"
                >
                </b-form-input>
                <span
                  v-if="!$v.boats.year__c.integer && $v.boats.year__c.$dirty"
                  class="text-danger"
                  >Boat year must be a year and contain no letters
                </span>
                <span
                  v-if="!$v.boats.year__c.required && $v.boats.year__c.$dirty"
                  class="text-danger"
                  >Boat Year is required!
                </span>
                <span
                  v-if="
                    !$v.boats.year__c.between &&
                      $v.boats.year__c.$dirty &&
                      $v.boats.year__c.integer
                  "
                  class="text-danger"
                  >Boat year must be between 1990 and 2021. No matter the age,
                  the boat must be in good working order in order to be serviced
                  by Sea Tow.
                </span>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group label="Boat Length:" label-for="nested-length">
                <b-form-input
                  id="nested-length"
                  v-model="$v.boats.length__c.$model"
                ></b-form-input>
                <span
                  v-if="
                    !$v.boats.length__c.required && $v.boats.length__c.$dirty
                  "
                  class="text-danger"
                  >Boat Length is required!
                </span>
                <span
                  v-if="
                    !$v.boats.length__c.integer && $v.boats.length__c.$dirty
                  "
                  class="text-danger"
                  >Boat Length in whole feet only
                </span>
                <span
                  v-if="
                    !$v.boats.length__c.between &&
                      $v.boats.length__c.$dirty &&
                      $v.boats.length__c.integer
                  "
                  class="text-danger"
                  >Sea Tow generally generally accepts boats between 1'-100'
                  feet. Below or above that may required special authorization.
                </span>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group label="Boat Make:" label-for="nested-make">
                <b-form-input
                  id="nested-make"
                  v-model="$v.boats.boat_make__c.$model"
                ></b-form-input>
                <span
                  v-if="
                    !$v.boats.boat_make__c.required &&
                      $v.boats.boat_make__c.$dirty
                  "
                  class="text-danger"
                  >Boat Make is required!
                </span>
              </b-form-group>
            </b-col>
          </b-form-row>

          <b-form-group
            label="Registration/Document Number:"
            label-for="nested-doc-num"
          >
            <b-form-input
              id="nested-doc-num"
              v-model="$v.boats.registration_document__c.$model"
            ></b-form-input>
          </b-form-group>

          <b-form-group label="Boat is kept at:">
            <b-form-select
              v-model="$v.boats.home_port_type__c.$model"
              :options="boat_kept_at_options"
              class="mb-3"
            >
              <template v-slot:first>
                <b-form-select-option :value="null" disabled
                  >-- Please select an option --</b-form-select-option
                >
              </template>
            </b-form-select>
            <span
              v-if="
                !$v.boats.home_port_type__c.required &&
                  $v.boats.home_port_type__c.$dirty
              "
              class="text-danger"
              >Boat Location is required!
            </span>
          </b-form-group>

          <b-form-row>
            <b-col>
              <b-form-group
                label="Boat Location City:"
                label-for="nested-boat-city"
              >
                <b-form-input
                  id="nested-boat-city"
                  v-model="$v.boats.home_port_city__c.$model"
                ></b-form-input>
                <span
                  v-if="
                    !$v.boats.home_port_city__c.required &&
                      $v.boats.home_port_city__c.$dirty
                  "
                  class="text-danger"
                  >Boat City is required!
                </span>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group
                label="Boat Location State:"
                label-for="nested-boat-state"
              >
                <b-form-select
                  v-model="$v.boats.home_port_state__c.$model"
                  :options="boat_state_options"
                  class="mb-3"
                >
                  <template v-slot:first>
                    <b-form-select-option :value="null" disabled
                      >-- Please select an option --</b-form-select-option
                    >
                  </template>
                </b-form-select>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group
                label="Boat Location Country:"
                label-for="nested-boat-country"
              >
                <b-form-select
                  v-model="$v.boats.home_port_country__c.$model"
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
                  v-if="
                    !$v.boats.home_port_country__c.required &&
                      $v.boats.home_port_country__c.$dirty
                  "
                  class="text-danger"
                  >Boat Country is required!
                </span>
              </b-form-group>
            </b-col>
          </b-form-row>
        </b-form-group>
      </b-card>

      <b-card bg-variant="light">
        <b-form-group
          label-cols-lg="2"
          label="Summary"
          label-size="lg"
          label-class="font-weight-bold pt-0"
          class="mb-0"
        >
        </b-form-group>

        <b-container class="bv-example-row">
          <div class="row info-row no-border">
            <div class="large-6 small-6 columns">
              <span>
                {{ this.CardSelection + ' Card' }}
              </span>
            </div>
            <div class="large-6 small-6 columns" style="text-align: right">
              <span class="membership-list-price">
                {{ this.card_price }}
              </span>
              <p class="plan">per year</p>
            </div>
          </div>

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
            <b-col>Trailering Selection Price</b-col>
            <b-col>{{ trailering_price }}</b-col>
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
  between,
  requiredIf,
} from 'vuelidate/lib/validators'

import axios from 'axios'

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
      account: {
        billingcity: null,
        billingcountry: null,
        billingpostalcode: null,
        billingstate: null,
        billingstreet: null,
        shippingcity: null,
        shippingcountry: null,
        shippingpostalcode: null,
        shippingstate: null,
        shippingstreet: null,
      },
      boats: {
        color__c: null,
        aor__c: 'a0d37000004fpkWAAQ',
        boat_make__c: null,
        boat_status__c: null,
        engine_type__c: null,
        fuel_type__c: null,
        hin__c: null,
        home_port_city__c: null,
        home_port_state__c: null,
        home_port_country__c: null,
        home_port_type__c: null,
        marina_name__c: null,
        length__c: null,
        number_of_engines__c: null,
        primary_boat__c: null,
        registration_document__c: null,
        year__c: null,
      },
      memberships: {
        auto_renew__c: null,
        card_expiration_date__c: null,
        card_name__c: null,
        card_number__c: null,
        card_security_code__c: null,
        card_type__c: null,
        referral_credit_amount__c: null,
        trailer_care_type__c: null,
      },
      routes: {
        contacts: null,
        boats: null,
        memberships: null,
        account: null,
      },
      sfid: {
        contact: null,
        boat: null,
        membership: null,
        account: null,
      },
      promotion_state_value: null,
      contact_sfid: null,
      boat_sfid: null,
      membership_sfid: null,
      account_sfid: null,
      renewal: false,
      profile_data: null,
      promotion_value_in_dollars: 0,
      promotion_type: null,
      promotion_valid_on_type: null,
      promotion_title: null,
      promotion_value_in_days: null,
      promotion_value_percentage_discount: null,
      promotion_desc: null,
      promotion_code: null,
      promotion_valid: false,
      promotion_price: '',
      jwt: null,
      submitStatus: null,
      firstName: '',
      lastName: '',
      email: null,
      secondaryPhone: null,
      street: null,
      street2: null,
      city: null,
      state: null,
      zipcode: null,
      country: null,
      boat_length: null,
      boat_make: null,
      boat_doc: null,
      boat_kept_at: null,
      boat_loc_city: null,
      boat_loc_state: null,
      boat_loc_country: null,
      autorenew_status: false,
      shipping_same_as_billing: true,
      card_price: 179.0,
      card_desc:
        'The choice of over 95% of Sea Tow members. This card provides membership benefits for any recreational vessel that has an engine and is registered to or owned by the member (covered vessels). Any person operating a covered vessel is entitled to receive membership benefits for that vessel. The Gold Card member may also use his/her privileges on any vessel he/she charters, rents, leases or borrows. For complete details on all Gold Card member privileges please see our Membership Agreement.',
      trailering_price: null,
      price_total: 179.0,
      promo_code: null,
      isHomeportFlorida: false,
      IsHomeportFloridaOptions: [
        { text: 'Yes', value: true },
        { text: 'No', value: false },
      ],
      CardSelection: 'Gold',
      TrailerOptions: [
        { text: 'Trailer Care Marine', value: 'Marine', cost: 14.0 },
        { text: 'Trailer Care Universal', value: 'Universal', cost: 29.95 },
        { text: 'No Roadside Assistance', value: 'None', cost: 0.0 },
      ],
      TrailerSelection: 'None',
      boat_kept_at_options: [
        { text: 'Marina', value: 'Marina' },
        { text: 'Home Dock', value: 'Home Dock' },
        { text: 'Trailer', value: 'Trailer' },
        { text: 'Mooring', value: 'Mooring' },
      ],
      country_options: [
        { value: 'United States', text: 'US' },
        { value: 'Canada', text: 'CA' },
      ],
      boat_state_options: [
        {
          value: 'Alabama',
          text: 'AL',
        },
        {
          value: 'Alaska',
          text: 'AK',
        },
        {
          value: 'American Samoa',
          text: 'AS',
        },
        {
          value: 'Arizona',
          text: 'AZ',
        },
        {
          value: 'Arkansas',
          text: 'AR',
        },
        {
          value: 'California',
          text: 'CA',
        },
        {
          value: 'Colorado',
          text: 'CO',
        },
        {
          value: 'Connecticut',
          text: 'CT',
        },
        {
          value: 'Delaware',
          text: 'DE',
        },
        {
          value: 'District Of Columbia',
          text: 'DC',
        },
        {
          value: 'Federated States Of Micronesia',
          text: 'FM',
        },
        {
          value: 'Florida',
          text: 'FL',
        },
        {
          value: 'Georgia',
          text: 'GA',
        },
        {
          value: 'Guam',
          text: 'GU',
        },
        {
          value: 'Hawaii',
          text: 'HI',
        },
        {
          value: 'Idaho',
          text: 'ID',
        },
        {
          value: 'Illinois',
          text: 'IL',
        },
        {
          value: 'Indiana',
          text: 'IN',
        },
        {
          value: 'Iowa',
          text: 'IA',
        },
        {
          value: 'Kansas',
          text: 'KS',
        },
        {
          value: 'Kentucky',
          text: 'KY',
        },
        {
          value: 'Louisiana',
          text: 'LA',
        },
        {
          value: 'Maine',
          text: 'ME',
        },
        {
          value: 'Marshall Islands',
          text: 'MH',
        },
        {
          value: 'Maryland',
          text: 'MD',
        },
        {
          value: 'Massachusetts',
          text: 'MA',
        },
        {
          value: 'Michigan',
          text: 'MI',
        },
        {
          value: 'Minnesota',
          text: 'MN',
        },
        {
          value: 'Mississippi',
          text: 'MS',
        },
        {
          value: 'Missouri',
          text: 'MO',
        },
        {
          value: 'Montana',
          text: 'MT',
        },
        {
          value: 'Nebraska',
          text: 'NE',
        },
        {
          value: 'Nevada',
          text: 'NV',
        },
        {
          value: 'New Hampshire',
          text: 'NH',
        },
        {
          value: 'New Jersey',
          text: 'NJ',
        },
        {
          value: 'New Mexico',
          text: 'NM',
        },
        {
          value: 'New York',
          text: 'NY',
        },
        {
          value: 'North Carolina',
          text: 'NC',
        },
        {
          value: 'North Dakota',
          text: 'ND',
        },
        {
          value: 'Northern Mariana Islands',
          text: 'MP',
        },
        {
          value: 'Ohio',
          text: 'OH',
        },
        {
          value: 'Oklahoma',
          text: 'OK',
        },
        {
          value: 'Oregon',
          text: 'OR',
        },
        {
          value: 'Palau',
          text: 'PW',
        },
        {
          value: 'Pennsylvania',
          text: 'PA',
        },
        {
          value: 'Puerto Rico',
          text: 'PR',
        },
        {
          value: 'Rhode Island',
          text: 'RI',
        },
        {
          value: 'South Carolina',
          text: 'SC',
        },
        {
          value: 'South Dakota',
          text: 'SD',
        },
        {
          value: 'Tennessee',
          text: 'TN',
        },
        {
          value: 'Texas',
          text: 'TX',
        },
        {
          value: 'Utah',
          text: 'UT',
        },
        {
          value: 'Vermont',
          text: 'VT',
        },
        {
          value: 'Virgin Islands',
          text: 'VI',
        },
        {
          value: 'Virginia',
          text: 'VA',
        },
        {
          value: 'Washington',
          text: 'WA',
        },
        {
          value: 'West Virginia',
          text: 'WV',
        },
        {
          value: 'Wisconsin',
          text: 'WI',
        },
        {
          value: 'Wyoming',
          text: 'WY',
        },
      ],
      state_options: [
        {
          text: 'Alabama',
          value: 'AL',
        },
        {
          text: 'Alaska',
          value: 'AK',
        },
        {
          text: 'American Samoa',
          value: 'AS',
        },
        {
          text: 'Arizona',
          value: 'AZ',
        },
        {
          text: 'Arkansas',
          value: 'AR',
        },
        {
          text: 'California',
          value: 'CA',
        },
        {
          text: 'Colorado',
          value: 'CO',
        },
        {
          text: 'Connecticut',
          value: 'CT',
        },
        {
          text: 'Delaware',
          value: 'DE',
        },
        {
          text: 'District Of Columbia',
          value: 'DC',
        },
        {
          text: 'Federated States Of Micronesia',
          value: 'FM',
        },
        {
          text: 'Florida',
          value: 'FL',
        },
        {
          text: 'Georgia',
          value: 'GA',
        },
        {
          text: 'Guam',
          value: 'GU',
        },
        {
          text: 'Hawaii',
          value: 'HI',
        },
        {
          text: 'Idaho',
          value: 'ID',
        },
        {
          text: 'Illinois',
          value: 'IL',
        },
        {
          text: 'Indiana',
          value: 'IN',
        },
        {
          text: 'Iowa',
          value: 'IA',
        },
        {
          text: 'Kansas',
          value: 'KS',
        },
        {
          text: 'Kentucky',
          value: 'KY',
        },
        {
          text: 'Louisiana',
          value: 'LA',
        },
        {
          text: 'Maine',
          value: 'ME',
        },
        {
          text: 'Marshall Islands',
          value: 'MH',
        },
        {
          text: 'Maryland',
          value: 'MD',
        },
        {
          text: 'Massachusetts',
          value: 'MA',
        },
        {
          text: 'Michigan',
          value: 'MI',
        },
        {
          text: 'Minnesota',
          value: 'MN',
        },
        {
          text: 'Mississippi',
          value: 'MS',
        },
        {
          text: 'Missouri',
          value: 'MO',
        },
        {
          text: 'Montana',
          value: 'MT',
        },
        {
          text: 'Nebraska',
          value: 'NE',
        },
        {
          text: 'Nevada',
          value: 'NV',
        },
        {
          text: 'New Hampshire',
          value: 'NH',
        },
        {
          text: 'New Jersey',
          value: 'NJ',
        },
        {
          text: 'New Mexico',
          value: 'NM',
        },
        {
          text: 'New York',
          value: 'NY',
        },
        {
          text: 'North Carolina',
          value: 'NC',
        },
        {
          text: 'North Dakota',
          value: 'ND',
        },
        {
          text: 'Northern Mariana Islands',
          value: 'MP',
        },
        {
          text: 'Ohio',
          value: 'OH',
        },
        {
          text: 'Oklahoma',
          value: 'OK',
        },
        {
          text: 'Oregon',
          value: 'OR',
        },
        {
          text: 'Palau',
          value: 'PW',
        },
        {
          text: 'Pennsylvania',
          value: 'PA',
        },
        {
          text: 'Puerto Rico',
          value: 'PR',
        },
        {
          text: 'Rhode Island',
          value: 'RI',
        },
        {
          text: 'South Carolina',
          value: 'SC',
        },
        {
          text: 'South Dakota',
          value: 'SD',
        },
        {
          text: 'Tennessee',
          value: 'TN',
        },
        {
          text: 'Texas',
          value: 'TX',
        },
        {
          text: 'Utah',
          value: 'UT',
        },
        {
          text: 'Vermont',
          value: 'VT',
        },
        {
          text: 'Virgin Islands',
          value: 'VI',
        },
        {
          text: 'Virginia',
          value: 'VA',
        },
        {
          text: 'Washington',
          value: 'WA',
        },
        {
          text: 'West Virginia',
          value: 'WV',
        },
        {
          text: 'Wisconsin',
          value: 'WI',
        },
        {
          text: 'Wyoming',
          value: 'WY',
        },
      ],
      membership_number__c: '42069',
      isRenew: false,
      search_type: null,
      response_data: [],
      full_data: [],
      isBusy: false,
      tableFields: [
        {
          label: 'Membership Number',
          key: 'membership_number__c',
          sortable: false,
        },
        {
          label: 'First Name',
          key: 'firstname',
          sortable: false,
        },
        {
          label: 'Last Name',
          key: 'lastname',
          sortable: false,
        },
        {
          label: 'Phone Number',
          key: 'phone',
          sortable: false,
        },
        {
          label: 'Mobile Phone Number',
          key: 'mobilephone',
          sortable: false,
        },
        {
          label: 'Email',
          key: 'email',
          sortable: false,
        },
        {
          label: 'Expiration Date',
          key: 'membership_expiration_date__c',
          sortable: false,
        },
        {
          label: 'Renew Membership',
          key: 'show_details',
          sortable: false,
        },
      ],
    }
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
        maxLength: maxLength(10),
      },
    },
    account: {
      billingcity: { required },
      billingcountry: { required },
      billingpostalcode: { required },
      billingstate: { required },
      billingstreet: { required },
      shippingcity: {
        required: requiredIf(function() {
          return !this.shipping_same_as_billing
        }),
      },
      shippingcountry: {
        required: requiredIf(function() {
          return !this.shipping_same_as_billing
        }),
      },
      shippingpostalcode: {
        required: requiredIf(function() {
          return !this.shipping_same_as_billing
        }),
      },
      shippingstate: {
        required: requiredIf(function() {
          return !this.shipping_same_as_billing
        }),
      },
      shippingstreet: {
        required: requiredIf(function() {
          return !this.shipping_same_as_billing
        }),
      },
      acc_name_vald: {},
    },
    boats: {
      year__c: {
        required,
        maxLength: maxLength(4),
        integer,
        between: between(1900, 2021),
      },
      length__c: {
        required,
        integer,
        maxLength: maxLength(3),
        between: between(1, 100),
      },
      boat_make__c: {
        required,
      },
      registration_document__c: {},
      home_port_type__c: { required },
      home_port_city__c: { required },
      home_port_state__c: { required },
      home_port_country__c: { required },
    },
    membership_number__c: {
      required,
      integer,
    },
    promotion_code: {
      required: requiredIf(function() {
        return this.promotion_code != null
      }),
    },
  },
  computed: {
    account_name: {
      get: function() {
        return this.contacts.firstname + ' ' + this.contacts.lastname
      },
      set: function() {
        this.account.acc_name_data =
          this.contacts.firstname + ' ' + this.contacts.lastname
      },
    },
    promotionstate() {
      return this.promotion_state_value
    },
    promotionFeedback() {
      if (!this.promotion_valid) {
        return 'This promotion code is not valid.'
      }

      return 'Enter a valid promotion code, if applicable.'
    },
    CardOptions() {
      return [
        {
          text: 'Gold Card',
          value: 'Gold',
          cost: 179.0,
          title:
            'The choice of over 95% of Sea Tow members. This card provides membership benefits for any recreational vessel that has an engine and is registered to or owned by the member (covered vessels). Any person operating a covered vessel is entitled to receive membership benefits for that vessel. The Gold Card member may also use his/her privileges on any vessel he/she charters, rents, leases or borrows. For complete details on all Gold Card member privileges please see our Membership Agreement.',
        },
        {
          text: 'Lake Card',
          value: 'Lake',
          cost: 119.0,
          disabled: this.$data.isHomeportFlorida,
          title:
            'If you boat on fresh, non-tidal, inland waterways (excluding Florida) then the Lake Card may be the perfect option for you. The Sea Tow Lake Card provides the same member benefits as the Gold Card, but on ALL fresh, non-tidal, inland waterways. For complete details on all Lake Card member privileges please see our Membership Agreement.',
        },
        {
          text: 'Commerical Card',
          value: 'Commercial',
          cost: 179.0,
          title:
            'This card provides service for commercial vessels. The Commercial Card covers the primary vessel only. Any person operating the primary vessel is entitled to receive all membership benefits for that vessel at $100 per hour.',
        },
        {
          text: 'Professional Mariner Card',
          value: 'ProfMariner',
          cost: 365.0,
          title:
            'If you make your living on the water, this card is for you. The Professional Mariner Card is a service package for individuals who regularly use multiple vessels in the performance of their maritime duties such as: yacht delivery captains, on-water instructors, etc. Any vessel the member is operating and is the master of, is entitled to receive membership benefits for that vessel, except Dock-to-Dock Tows.',
        },
        {
          text: 'Trial Gold Card (temporarily disabled)',
          value: 'TrialGold',
          disabled: true,
          cost: 0.0,
          title:
            'The choice of over 95% of Sea Tow members. This card provides membership benefits for any recreational vessel that has an engine and is registered to or owned by the member (covered vessels). Any person operating a covered vessel is entitled to receive membership benefits for that vessel. The Gold Card member may also use his/her privileges on any vessel he/she charters, rents, leases or borrows. For complete details on all Gold Card member privileges please see our Membership Agreement.',
        },
        {
          text: 'Trial Lake Card (temporarily disabled)',
          value: 'TrialLake',
          disabled: true,
          cost: 0.0,
          title:
            'The choice of over 95% of Sea Tow members. This card provides membership benefits for any recreational vessel that has an engine and is registered to or owned by the member (covered vessels). Any person operating a covered vessel is entitled to receive membership benefits for that vessel. The Gold Card member may also use his/her privileges on any vessel he/she charters, rents, leases or borrows. For complete details on all Gold Card member privileges please see our Membership Agreement.',
        },
      ]
    },
  },
  methods: {
    abbrRegion(input, to) {
      var states = [
        ['Alabama', 'AL'],
        ['Alaska', 'AK'],
        ['American Samoa', 'AS'],
        ['Arizona', 'AZ'],
        ['Arkansas', 'AR'],
        ['Armed Forces Americas', 'AA'],
        ['Armed Forces Europe', 'AE'],
        ['Armed Forces Pacific', 'AP'],
        ['California', 'CA'],
        ['Colorado', 'CO'],
        ['Connecticut', 'CT'],
        ['Delaware', 'DE'],
        ['District Of Columbia', 'DC'],
        ['Florida', 'FL'],
        ['Georgia', 'GA'],
        ['Guam', 'GU'],
        ['Hawaii', 'HI'],
        ['Idaho', 'ID'],
        ['Illinois', 'IL'],
        ['Indiana', 'IN'],
        ['Iowa', 'IA'],
        ['Kansas', 'KS'],
        ['Kentucky', 'KY'],
        ['Louisiana', 'LA'],
        ['Maine', 'ME'],
        ['Marshall Islands', 'MH'],
        ['Maryland', 'MD'],
        ['Massachusetts', 'MA'],
        ['Michigan', 'MI'],
        ['Minnesota', 'MN'],
        ['Mississippi', 'MS'],
        ['Missouri', 'MO'],
        ['Montana', 'MT'],
        ['Nebraska', 'NE'],
        ['Nevada', 'NV'],
        ['New Hampshire', 'NH'],
        ['New Jersey', 'NJ'],
        ['New Mexico', 'NM'],
        ['New York', 'NY'],
        ['North Carolina', 'NC'],
        ['North Dakota', 'ND'],
        ['Northern Mariana Islands', 'NP'],
        ['Ohio', 'OH'],
        ['Oklahoma', 'OK'],
        ['Oregon', 'OR'],
        ['Pennsylvania', 'PA'],
        ['Puerto Rico', 'PR'],
        ['Rhode Island', 'RI'],
        ['South Carolina', 'SC'],
        ['South Dakota', 'SD'],
        ['Tennessee', 'TN'],
        ['Texas', 'TX'],
        ['US Virgin Islands', 'VI'],
        ['Utah', 'UT'],
        ['Vermont', 'VT'],
        ['Virginia', 'VA'],
        ['Washington', 'WA'],
        ['West Virginia', 'WV'],
        ['Wisconsin', 'WI'],
        ['Wyoming', 'WY'],
      ]

      var provinces = [
        ['Alberta', 'AB'],
        ['British Columbia', 'BC'],
        ['Manitoba', 'MB'],
        ['New Brunswick', 'NB'],
        ['Newfoundland', 'NF'],
        ['Northwest Territory', 'NT'],
        ['Nova Scotia', 'NS'],
        ['Nunavut', 'NU'],
        ['Ontario', 'ON'],
        ['Prince Edward Island', 'PE'],
        ['Quebec', 'QC'],
        ['Saskatchewan', 'SK'],
        ['Yukon', 'YT'],
      ]

      var regions = states.concat(provinces)

      var i
      if (to == 'abbr') {
        input = input.replace(/\w\S*/g, function(txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        })
        for (i = 0; i < regions.length; i++) {
          if (regions[i][0] == input) {
            return regions[i][1]
          }
        }
      } else if (to == 'name') {
        input = input.toUpperCase()
        for (i = 0; i < regions.length; i++) {
          if (regions[i][1] == input) {
            return regions[i][0]
          }
        }
      }
    },
    async submitSearchForm() {
      this.$bvToast.toast(
        `Searching using '${this.membership_number__c}' as criteria.`,
        {
          title: 'Searching for member',
          autoHideDelay: 2000,
        }
      )

      let data = {
        search_term: this.membership_number__c,
        search_type: this.search_type,
      }
      axios
        .post(`${process.env.VUE_APP_APIURL}/utility/search/`, data)
        .then((response) => {
          console.log(response)
          response['data'].forEach(
            (element) => (element['show_details'] = false)
          )
          this.toggleBusy()
          this.response_data = response['data']
          if (this.response_data.length > 0) {
            this.$bvToast.toast(
              `Found ${this.response_data.length} possible ${
                this.response_data.length > 1 ? 'matches' : 'match'
              }.`,
              {
                title: 'Matches found.',
                autoHideDelay: 5000,
              }
            )
          } else {
            this.$bvToast.toast(
              'No matches, nothing to display. Try refining your search criteria.',
              {
                title: 'No matches found.',
                autoHideDelay: 5000,
              }
            )
          }
        })
    },
    clearForm() {
      var contact_parsed_obj = JSON.parse(JSON.stringify(this.contacts))
      var contact_keynames = Object.keys(contact_parsed_obj)
      var account_parsed_obj = JSON.parse(JSON.stringify(this.account))
      var account_keynames = Object.keys(account_parsed_obj)
      var boats_parsed_obj = JSON.parse(JSON.stringify(this.boats))
      var boats_keynames = Object.keys(boats_parsed_obj)
      var memberships_parsed_obj = JSON.parse(JSON.stringify(this.memberships))
      var memberships_keynames = Object.keys(memberships_parsed_obj)

      contact_keynames.forEach((name) => {
        this.contacts[name] = null
      })

      account_keynames.forEach((name) => {
        this.account[name] = null
      })

      boats_keynames.forEach((name) => {
        this.boats[name] = null
      })

      memberships_keynames.forEach((name) => {
        this.memberships[name] = null
      })

      this.isHomeportFlorida = false
      this.CardSelection = 'Gold'
      this.TrailerSelection = 'None'
      this.isRenew = !this.isRenew

      this.$bvToast.toast('Data has been cleared from the form.', {
        title: 'Data cleared',
        autoHideDelay: 5000,
      })
    },
    toggleBusy() {
      this.isBusy = !this.isBusy
    },
    /**
     * Generates a GUID string.
     * @returns {string} The generated GUID.
     * @example af8a8416-6e18-a307-bd9c-f2c947bbb3aa
     * @author Slavik Meltser.
     * @link http://slavik.meltser.info/?p=142
     */
    guid() {
      function _p8(s) {
        var p = (Math.random().toString(16) + '000000000').substr(2, 8)
        return s ? '-' + p.substr(0, 4) + '-' + p.substr(4, 4) : p
      }
      return _p8() + _p8(true) + _p8(true) + _p8()
    },
    RenewMembership(row, index, detailsShowing) {
      if (!detailsShowing) {
        row.toggleDetails()
        let data = {
          accountid: this.response_data[index]['account__c'],
        }

        axios
          .post(`${process.env.VUE_APP_APIURL}/utility/getallinfo/`, data)
          .then((response) => {
            this.response_data[index]['full_data'] = response['data']
          })
          .then(() => {
            var contact_parsed_obj = JSON.parse(JSON.stringify(this.contacts))
            var contact_keynames = Object.keys(contact_parsed_obj)

            var boat_parsed_obj = JSON.parse(JSON.stringify(this.boats))
            var boat_keynames = Object.keys(boat_parsed_obj)

            var account_parsed_obj = JSON.parse(JSON.stringify(this.account))
            var account_keynames = Object.keys(account_parsed_obj)

            var membership_parsed_obj = JSON.parse(
              JSON.stringify(this.memberships)
            )
            var membership_keynames = Object.keys(membership_parsed_obj)

            this.routes.contacts = this.response_data[index]['full_data'][
              'contacts'
            ][0]['sfid']
            this.contact_sfid = this.response_data[index]['full_data'][
              'contacts'
            ][0]['sfid']
            contact_keynames.forEach((name) => {
              this.contacts[name] = this.response_data[index]['full_data'][
                'contacts'
              ][index][name]
            })

            this.routes.account = this.response_data[index]['full_data'][
              'contacts'
            ][0]['sfid']
            this.account_sfid = this.response_data[index]['full_data'][
              'account'
            ][0]['sfid']
            account_keynames.forEach((name) => {
              this.account[name] = this.response_data[index]['full_data'][
                'account'
              ][index][name]
            })

            this.routes.boats = this.response_data[index]['full_data'][
              'contacts'
            ][0]['sfid']
            this.boat_sfid = this.response_data[index]['full_data']['boats'][0][
              'sfid'
            ]
            boat_keynames.forEach((name) => {
              this.boats[name] = this.response_data[index]['full_data'][
                'boats'
              ][index][name]
            })

            this.routes.memberships = this.response_data[index]['full_data'][
              'contacts'
            ][0]['sfid']
            this.membership_sfid = this.response_data[index]['full_data'][
              'memberships'
            ][0]['sfid']
            membership_keynames.forEach((name) => {
              this.memberships[name] = this.response_data[index]['full_data'][
                'memberships'
              ][index][name]
            })

            if (this.account.shippingstreet == this.account.billingstreet) {
              this.shipping_same_as_billing = true
            } else {
              this.shipping_same_as_billing = false
            }
            this.isRenew = !this.isRenew
            this.$bvToast.toast(
              "The form has been populated with the member's information.",
              {
                title: 'Data populated.',
                autoHideDelay: 5000,
              }
            )
          })
      } else {
        this.detailsShowing = false
      }
    },
    ExpandAndShowData(row, index, detailsShowing) {
      if (!detailsShowing) {
        let data = {
          accountid: this.response_data[index]['account__c'],
        }

        axios
          .post(`${process.env.VUE_APP_APIURL}/utility/getallinfo/`, data)
          .then((response) => {
            this.response_data[index]['full_data'] = response['data']
          })
          .then(() => {
            row.toggleDetails()
          })
      } else {
        row.toggleDetails()
      }
    },
    createLead(token) {
      console.log('Starting Create lead')

      let data = {
        headers: {
          Authorization: 'JWT ' + token,
        },
        lastname: this.lastName,
        company: 'Dealer Portal Test',
        status: 'Active',
        home_port_type__c: this.boat_kept_at,
      }

      axios
        .post(`${process.env.VUE_APP_APIURL}/leads/`, data)
        .then((response) => {
          console.log(response)
        })
    },
    calculatePrice() {},
    getJWT() {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve('Calling Authenticate')
          this.Authenticate()
        }, 500)
      })
    },
    async Authenticate() {
      //replace dynamically or set to a dealer user specifically
      let data = {
        username: 'patrick',
        password: 'abc123',
      }

      axios
        .post(`${process.env.VUE_APP_APIURL}/auth`, data)
        .then((response) => {
          this.access_token = response.data.access_token
          return response.data.access_token
        })
    },
    preventDisabledAndChecked(isHomeportInFlorida) {
      if (isHomeportInFlorida && this.$data.CardSelection == 'Lake') {
        document.getElementById(
          'card-selection-radio_BV_option_0'
        ).checked = true

        document.getElementById(
          'carddescription'
        ).innerHTML = this.CardOptions[0].title

        this.CardSelection = 'Gold'
        this.updateCartPrice('Gold')

        this.$bvToast.toast("You can't have a Lake Card in Florida.", {
          title: 'Invalid selections.',
          autoHideDelay: 5000,
        })
      }
    },
    async submitPromo(promotion) {
      this.$bvToast.toast(
        `We're searching for the promotion code ${promotion}`,
        {
          title: 'Searching for promotions',
          autoHideDelay: 2000,
        }
      )

      axios
        .post(`${process.env.VUE_APP_APIURL}/utility/promos/`, {
          promotion_code: promotion,
        })
        .then(
          (response) => {
            if (response.data != null) {
              if ('Error' in response.data) {
                if (
                  response.data['Error'].localeCompare(
                    'No active promotion codes found with the provided promo code.'
                  ) == 0
                ) {
                  this.promotion_state_value = false
                  this.$bvToast.toast(`${promotion} was not found.`, {
                    title: 'Promotion code not found',
                    autoHideDelay: 5000,
                  })
                } else if (
                  response.data['Error'].localeCompare(
                    'The promotion code is no longer active.'
                  ) != 0
                ) {
                  this.promotion_state_value = false
                  this.$bvToast.toast(
                    'This promotion code is either no longer active, or not applicable to the current membership.',
                    {
                      title: 'Invalid promotion code.',
                      autoHideDelay: 5000,
                    }
                  )
                }
              } else {
                this.$bvToast.toast(
                  `We've found ${promotion}. The type is: ${response.data['promotion_type__c']}`,
                  {
                    title: 'Promotion found!',
                    autoHideDelay: 5000,
                  }
                )
                this.promotion_state_value = true
                this.promotion_sfid = response.data['sfid']
                this.promotion_valid = true
                this.promotion_value_in_days =
                  response.data['value_time_in_days__c']
                this.promotion_price =
                  response.data['value_discount_in_dollars__c']
                this.promotion_type = response.data['promotion_type__c']
                this.promotion_desc = response.data['promotion_details__c']
                this.promotion_title = response.data['title__c']
                this.updateCartPrice()
              }
            }
          },
          (error) => {
            console.log(error)
          }
        )
    },
    resetPromotionDetails() {
      this.promotion_state_value = null
      this.promotion_valid = false
      this.promotion_price = 0
      this.promotion_type__c = null
      this.title__c = null
      this.promotion_value_in_dollars = null
      this.promotion_value_in_days = null
      this.promotion_code = null
      this.promotion_details__c = null
      this.promotion_desc = null

      this.$bvToast.toast('Promotion code cleared from the form.', {
        title: 'Promotion cleared',
        autoHideDelay: 3000,
      })
    },
    async submitForm() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        if (
          this.shipping_same_as_billing == 'true' ||
          this.shipping_same_as_billing == true
        ) {
          this.account.shippingstreet = this.account.billingstreet
          this.account.shippingstate = this.account.billingstate
          this.account.shippingcity = this.account.billingcity
          this.account.shippingpostalcode = this.account.billingpostalcode
          this.account.shippingcountry = this.account.billingcountry
        }

        var account_parsed_obj = JSON.parse(JSON.stringify(this.account))
        var account_keynames = Object.keys(account_parsed_obj)

        var contact_parsed_obj = JSON.parse(JSON.stringify(this.contacts))
        var contact_keynames = Object.keys(contact_parsed_obj)

        var boat_parsed_obj = JSON.parse(JSON.stringify(this.boats))
        var boat_keynames = Object.keys(boat_parsed_obj)

        var membership_parsed_obj = JSON.parse(JSON.stringify(this.memberships))
        var membership_keynames = Object.keys(membership_parsed_obj)

        let headers = {
          'Content-Type': 'application/json',
        }

        let data = {}

        if (this.isRenew) {
          this.$bvToast.toast('Starting the renewal process.', {
            title: 'Starting renewal.',
            autoHideDelay: 5000,
          })
          var sfid_parsed_obj = JSON.parse(JSON.stringify(this.routes))
          var sfid_keynames = Object.keys(sfid_parsed_obj)

          data = {}

          sfid_keynames.forEach((field) => {
            if (field == 'account') {
              field = 'accounts'
              account_keynames.forEach((field) => {
                data[field] = account_parsed_obj[field]
              })

              data['sfid'] = this.account_sfid
            } else if (field == 'boats') {
              boat_keynames.forEach((field) => {
                if (field == 'home_port_country__c') {
                  data[field] = this.abbrRegion(
                    this.boats.home_port_country__c,
                    'name'
                  )
                }
                data[field] = boat_parsed_obj[field]
              })
              data['sfid'] = this.boat_sfid
            } else if (field == 'memberships') {
              membership_keynames.forEach((field) => {
                data[field] = membership_parsed_obj[field]
              })
              data['sfid'] = this.membership_sfid
            } else if (field == 'contacts') {
              contact_keynames.forEach((field) => {
                data[field] = contact_parsed_obj[field]
              })
              data['sfid'] = this.contact_sfid
            }

            axios({
              method: 'patch',
              url: `${process.env.VUE_APP_APIURL}/${field}/`,
              data: data,
              headers: headers,
            })
              .then((response) => {
                console.log(response)
              })
              .catch(function(error) {
                this.$bvToast.toast(`The following error occured: ${error}`, {
                  title: 'An Error Occured',
                  autoHideDelay: 5000,
                })
              })

            data = {}
          })

          this.$bvToast.toast('Update successful.', {
            title: 'Starting renewal.',
            autoHideDelay: 5000,
          })
        } else {
          const acc_guid = this.guid()
          data['heroku_external_id__c'] = acc_guid
          data['account_detail_type__c'] = 'Customer - Retail'
          data['type'] = 'General'
          data['name'] = this.account_name
          data['recordtypeid'] = '01237000000Tgx2AAC'
          account_keynames.forEach((field) => {
            data[field] = account_parsed_obj[field]
          })

          axios({
            method: 'post',
            url: `${process.env.VUE_APP_APIURL}/accounts/`,
            data: data,
            headers: headers,
          }).then((response) => {
            data = {}

            if (!('error' in response)) {
              const cont_guid = this.guid()
              data['account__heroku_external_id__c'] = acc_guid // Account ID
              data['recordtypeid'] = '01237000000TgqkAAC'
              data['heroku_external_id__c'] = cont_guid
              contact_keynames.forEach((field) => {
                data[field] = contact_parsed_obj[field]
              })

              axios({
                method: 'post',
                url: `${process.env.VUE_APP_APIURL}/contacts/`,
                data: data,
                headers: headers,
              }).then((response) => {
                data = {}
                if (!('error' in response)) {
                  const memb_guid = this.guid()
                  data['account__r__heroku_external_id__c'] = acc_guid
                  data[
                    'membership_contact__r__heroku_external_id__c'
                  ] = cont_guid
                  data['heroku_external_id__c'] = memb_guid

                  membership_keynames.forEach((field) => {
                    data[field] = membership_parsed_obj[field]
                  })

                  axios({
                    method: 'post',
                    url: `${process.env.VUE_APP_APIURL}/memberships/`,
                    data: data,
                    headers: headers,
                  }).then((response) => {
                    data = {}
                    if (!('error' in response)) {
                      const boat_guid = this.guid()

                      data['heroku_external_id__c'] = boat_guid
                      data['account__r__heroku_external_id__c'] = acc_guid
                      data['contact__r__heroku_external_id__c'] = cont_guid
                      data[
                        'related_membership__r__heroku_external_id__c'
                      ] = memb_guid

                      boat_keynames.forEach((field) => {
                        data[field] = boat_parsed_obj[field]
                      })

                      axios({
                        method: 'post',
                        url: `${process.env.VUE_APP_APIURL}/boats/`,
                        data: data,
                        headers: headers,
                      }).then((response) => {
                        data = {}
                        if (!('error' in response)) {
                          const opp_guid = this.guid()

                          data['heroku_external_id__c'] = opp_guid
                          data['name'] = 'Pending Invoice Number'
                          data['closedate'] = new Date().toISOString()
                          data['stagename'] = 'Invoice Open'
                          data['account__heroku_external_id__c'] = acc_guid
                          data[
                            'membership__r__heroku_external_id__c'
                          ] = memb_guid

                          axios({
                            method: 'post',
                            url: `${process.env.VUE_APP_APIURL}/opportunities/`,
                            data: data,
                            headers: headers,
                          }).then((response) => {
                            if (!('error' in response)) {
                              data = {}

                              data['contact__heroku_external_id__c'] = cont_guid
                              data[
                                'opportunity__heroku_external_id__c'
                              ] = opp_guid
                              data['role'] = 'Primary Member'
                              axios({
                                method: 'post',
                                url: `${process.env.VUE_APP_APIURL}/contactroles/`,
                                data: data,
                                headers: headers,
                              }).then((response) => {
                                if (!('error' in response)) {
                                  data = {}

                                  var selected_products = []

                                  var product_ids = {
                                    gold: '01t37000000YWRM',
                                    lake: '01t37000000YWRW',
                                    profmariner: '01t37000000YWRq',
                                    commercial: '01t37000000YWR2',
                                    marine: '01t37000000YWSA',
                                    universal: '01t37000001Ruzn',
                                  }

                                  selected_products.push(
                                    product_ids[
                                      this.CardSelection.toLowerCase()
                                    ]
                                  )
                                  this.TrailerSelection == 'None'
                                    ? console.log('No TC selected')
                                    : selected_products.push(
                                        product_ids[
                                          this.TrailerSelection.toLowerCase()
                                        ]
                                      )
                                  data[
                                    'opportunity__heroku_external_id__c'
                                  ] = opp_guid
                                  data['quantity'] = 1

                                  selected_products.forEach((element) => {
                                    if (element == '01t37000000YWRM') {
                                      data['pricebookentryid'] =
                                        '01u37000000wNq8'
                                      data['unitprice'] = this.card_price
                                      data['product2id'] = element
                                      data['listprice'] = 179.0
                                    } else if (element == '01t37000000YWRW') {
                                      data['pricebookentryid'] =
                                        '01u37000002MUok'
                                      data['unitprice'] = this.card_price
                                      data['product2id'] = element
                                      data['listprice'] = 119.0
                                    } else if (element == '01t37000000YWRq') {
                                      data['pricebookentryid'] =
                                        '01u37000002PAWz'
                                      data['unitprice'] = this.card_price
                                      data['product2id'] = element
                                      data['listprice'] = 365.0
                                    } else if (element == '01t37000000YWR2') {
                                      data['pricebookentryid'] =
                                        '01u37000000wNqI'
                                      data['unitprice'] = this.card_price
                                      data['product2id'] = element
                                      data['listprice'] = 179.0
                                    } else if (element == '01t37000000YWSA') {
                                      data['pricebookentryid'] =
                                        '01u37000002MUou'
                                      data['unitprice'] = this.trailering_price
                                      data['product2id'] = element
                                      data['listprice'] = 14.0
                                    } else if (element == '01t37000001Ruzn') {
                                      data['pricebookentryid'] =
                                        '01u37000002MsSI'
                                      data['unitprice'] = this.trailering_price
                                      data['product2id'] = element
                                      data['listprice'] = 29.95
                                    } else {
                                      console.log('not found')
                                    }

                                    console.log(data)

                                    axios({
                                      method: 'post',
                                      url: `${process.env.VUE_APP_APIURL}/opportunitylineitems/`,
                                      data: data,
                                      headers: headers,
                                    }).then((response) => {
                                      console.log('response: ')
                                      console.log(response)
                                    })
                                  })
                                }
                              })
                            }

                            /*
                      
                        OpportunityLineItems- Opportunity, Product2
                        Payment - Account, Opportunity, Contact, ARB subscription (this should automatically be done though when taking a credit card payment)
                      */
                          })
                        }
                      })
                    }
                  })
                }
              })
            }
          })
        }
      } else {
        this.$bvToast.toast(
          "Something isn't right with the form. Please validate each field.",
          {
            title: 'Validation error.',
            autoHideDelay: 5000,
          }
        )
      }
    },
    GetCardDesc(cardName) {
      var co = this.CardOptions
      var i = 0
      for (i = 0; i < co.length; i++) {
        if (cardName == co[i].value) {
          this.card_desc = co[i].title
        }
      }
    },
    UpdateCardDesc(event) {
      this.GetCardDesc(event)
      document.getElementById('carddescription').innerHTML = this.card_desc
      this.updateCartPrice(event)
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

      this.price_total = this.calculateCartPrice()
    },
    calculateCartPrice() {
      return this.card_price + this.trailering_price
    },
  },
}
</script>
