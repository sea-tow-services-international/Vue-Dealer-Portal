<template>
  <b-container class="container-fluid">
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

          <b-row style="margin-right: auto">
            <b-col>
              <b-form-input
                style="padding-bottom: 10"
                id="membership_number__c"
                v-model="$v.membership_number__c.$model"
                placeholder="Enter an email, phone number, or membership number"
              ></b-form-input>
            </b-col>

            <b-button-toolbar>
              <b-button-group>
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
                <b-button @click="clearForm" type="button" variant="primary"
                  >Clear Form</b-button
                >
              </b-button-group>

              <b-button-group>
                <b-button
                  class="text-nowrap"
                  v-if="this.response_data.length > 0"
                  @click="clearTable"
                  type="submit"
                  variant="primary"
                  :disabled="!this.response_data.length > 0"
                  >Clear Search</b-button
                >
              </b-button-group>
            </b-button-toolbar>
          </b-row>

          <template>
            <div style="padding-top: 10px">
              <b-table
                :fields="tableFields"
                :items="response_data"
                :busy="isBusy"
                bordered
                striped
                responsive
              >
                <template #table-busy>
                  <div class="text-center text-danger my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>Searching...</strong>
                  </div>
                </template>
                <template #cell(show_details)="row">
                  <b-button
                    size="sm"
                    @click="RenewMembership(row, row.index, row.detailsShowing)"
                    class="mr-2"
                  >
                    {{ row.detailsShowing ? "Clear From Form" : "Fill Form" }}
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
            <!-- <b-form-group
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
            </b-form-group> -->

            <b-form-group label="Select Membership Type">
              <b-row>
                <b-col sm="4">
                  <b-form-radio-group
                    @change="updateCartPrice($event)"
                    class="text-nowrap"
                    id="card-selection-radio"
                    v-model="CardSelection"
                    :options="CardOptions"
                    name="cardtype-radio-options"
                    stacked
                  ></b-form-radio-group>
                </b-col>

                <!-- <b-col cols="8">
                  <span id="carddescription">
                    {{ this.card_desc }}
                  </span>
                </b-col> -->
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

            <hr />
            <b-form-group
              class="w-100"
              label-for="donation_amount"
              v-if="!this.CardSelection.includes('Trial')"
            >
              <p
                v-html="donation_label"
                v-b-tooltip.hover="donation_tooltip"
              ></p>
              <p />
              <b-input-group prepend="$" class="w-25">
                <b-form-input
                  id="donation_amount"
                  v-model="$v.donation_amount.$model"
                  @keypress="stripTheGarbage($event)"
                  @blur="formatDollars()"
                >
                </b-form-input>
              </b-input-group>
            </b-form-group>
          </b-form-group>
        </b-card>

        <b-card bg-variant="light" v-if="this.CardSelection.includes('Trial')">
          <b-form-group
            label-cols-lg="3"
            label="Trial Time"
            label-size="lg"
            label-class="font-weight-bold pt-0"
            class="mb-0"
          >
            <b-form-row>
              <b-col>
                <b-form-group
                  label="Select how long trial lasts:"
                  label-for="trial-selecter"
                >
                </b-form-group>
                <b-form-select
                  v-model="$v.selected_trial_time_product.$model"
                  :options="TrialOptions"
                  class="mb-3"
                >
                  <template v-slot:first>
                    <b-form-select-option
                      :value="null"
                      disabled
                      id="trial-selecter"
                      >-- Please select an option --</b-form-select-option
                    >
                  </template>
                </b-form-select>

                <span
                  v-if="
                    !$v.selected_trial_time_product.required &&
                    $v.selected_trial_time_product.$dirty
                  "
                  class="text-danger"
                  >Required if free trial!
                </span>
              </b-col>
            </b-form-row>
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
              <b-form-input
                id="account-name"
                v-model="this.account_name"
                disabled
              >
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
                    v-if="
                      !$v.contacts.phone.required && $v.contacts.phone.$dirty
                    "
                    class="text-danger"
                    >Primary Phone is required!
                  </span>

                  <span
                    v-if="
                      !$v.contacts.phone.integer && $v.contacts.phone.$dirty
                    "
                    class="text-danger"
                    >Phone numbers should consist of only numbers. ex:
                    6315664283
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
                    >Phone numbers should consist of only numbers. ex:
                    6315664283
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

        <b-card bg-variant="light" v-if="!this.CardSelection.includes('Trial')">
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
            this.shipping_same_as_billing == false ||
            this.CardSelection.includes('Trial')
          "
        >
          <b-form-group
            label-cols-lg="3"
            label="Shipping Address"
            label-size="lg"
            label-class="font-weight-bold pt-0"
            class="mb-0"
          >
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
            <b-form-row>
              <b-col>
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
              </b-col>
              <b-col>
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
              </b-col>
              <b-col cols="4">
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
              </b-col>
            </b-form-row>

            <b-form-group label="Country:" label-for="nested-country">
              <b-form-select
                v-model="$v.account.shippingcountry.$model"
                :options="country_options"
                class="mb-3"
              >
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
                    >Boat year must be between 1900 and
                    {{ this.current_year_add_one }}.
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
                    >Sea Tow generally generally accepts boats between 1'- 65'
                    feet. Below or above that may required special
                    authorization.
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

            <b-form-row>
              <b-col>
                <b-form-group label="Boat Color:" label-for="nested-color">
                  <b-form-input
                    id="nested-color"
                    v-model="$v.boats.color__c.$model"
                    @keypress="stripNonAlpha($event)"
                  >
                  </b-form-input>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group label="Engine Type:" label-for="nested-engine">
                  <b-form-select
                    v-model="$v.boats.engine_type__c.$model"
                    :options="EngineTypeOptions"
                    class="mb-3"
                  >
                  </b-form-select>
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
                <b-form-group label label-for="nested-hp-desc">
                  {{ this.marina_desc }}
                  <b-form-input
                    id="nested-hp-desc"
                    v-model="$v.boats.marina_name__c.$model"
                  ></b-form-input>
                  <span
                    v-if="
                      !$v.boats.marina_name__c.required &&
                      $v.boats.marina_name__c.$dirty
                    "
                    class="text-danger"
                    >Home port description is required!
                  </span>
                </b-form-group>
              </b-col>
            </b-form-row>

            <b-form-row>
              <b-col>
                <b-form-group label="Boat City:" label-for="nested-boat-city">
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
                <b-form-group label="Boat State:" label-for="nested-boat-state">
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
                  label="Boat Country:"
                  label-for="nested-boat-country"
                >
                  <b-form-select
                    v-model="$v.boats.home_port_country__c.$model"
                    :options="country_options"
                    class="mb-3"
                  >
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
            label-cols-lg="3"
            label="Codes"
            label-size="lg"
            label-class="font-weight-bold pt-0"
            class="mb-0"
          >
            <b-form-group
              v-if="!this.CardSelection.includes('Trial')"
              label="Promotion Code:"
              label-for="promotion-code"
              :state="promotionstate"
              :invalid-feedback="promotionFeedback"
              valid-feedback="Promotion code successfully applied"
            >
              <b-row v-if="!this.CardSelection.includes('Trial')">
                <b-col>
                  <b-form
                    @submit.prevent="submitPromo(promotion_code)"
                    id="promotion_code"
                  >
                    <b-form-input
                      id="promotion-code"
                      v-model="$v.promotion_code.$model"
                      :state="promotionstate"
                      trim
                    >
                    </b-form-input>
                  </b-form>
                </b-col>
                <b-col>
                  <b-button-toolbar>
                    <div>
                      <b-button-group>
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

            <b-form-group
              label="Campaign:"
              label-for="campaign"
              :state="campaignstate"
              :invalid-feedback="campaignFeedback"
              valid-feedback="Campaign successfully applied"
            >
              <b-row>
                <b-col>
                  <b-form
                    @submit.prevent="submitCampaign(campaign)"
                    id="promotion_code"
                  >
                    <b-form-input
                      id="campaign"
                      v-model="$v.campaign.$model"
                      :state="campaignstate"
                      trim
                    >
                    </b-form-input>
                  </b-form>
                </b-col>
                <b-col>
                  <b-button-toolbar>
                    <div>
                      <b-button-group>
                        <b-button
                          @click="submitCampaign(campaign)"
                          type="button"
                          variant="primary"
                          >Apply</b-button
                        ></b-button-group
                      >

                      <b-button-group class="mx-1">
                        <b-button
                          @click="resetCampaignDetails()"
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

        <b-card bg-variant="light" v-if="this.price_total != 0">
          <b-form-group
            label-cols-lg="3"
            label="Payment Information"
            label-size="lg"
            label-class="font-weight-bold pt-0"
            class="mb-0"
          >
            <b-form-group>
              <b-form-row>
                <b-col>
                  <div id="tooptip-test">
                    <b-form-checkbox
                      v-b-tooltip.hover
                      title="If the funds were collected locally, no need to enter payment information unless auto-renew is selected. We insert into salesforce with a credit."
                      id="funds-collected-locally-checkbox"
                      v-model="funds_collected_locally"
                      name="fundscollectedlocally"
                      value="true"
                      unchecked-value="false"
                    >
                      Funds Collected Locally
                    </b-form-checkbox>
                  </div>
                </b-col>
              </b-form-row>
            </b-form-group>

            <b-form-row
              v-if="
                (funds_collected_locally == 'false' ||
                funds_collected_locally == false) || (autorenew_status == true || autorenew_status == 'true')
              "
            >
              <b-col>
                <b-form-group label="Card Number:" label-for="cc-number">
                  <b-form-input
                    id="cc-number"
                    v-model="$v.memberships.card_number__c.$model"
                  >
                  </b-form-input>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group label="Expiration Month:">
                  <b-form-select
                    v-model="$v.card_expiration_month.$model"
                    :options="cc_month_options"
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
                <b-form-group label="Expiration Year:">
                  <b-form-select
                    v-model="$v.card_expiration_year.$model"
                    :options="cc_year_options"
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
            </b-form-row>
            <b-form-row
            v-if="
                (funds_collected_locally == 'false' ||
                funds_collected_locally == false) || (autorenew_status == true || autorenew_status == 'true')
              "
            >
              <b-col>
                <b-form-group label="CCV:" label-for="ccv-number">
                  <b-form-input
                    id="ccv-number"
                    v-model="$v.memberships.card_security_code__c.$model"
                  >
                  </b-form-input>
                </b-form-group>
              </b-col>
              <b-col> </b-col>
              <b-col> </b-col>
            </b-form-row>

            <b-form-row>
              <b-col>
                <b-form-checkbox
                  v-b-tooltip.hover
                  title="Make sure to read the disclaimer directly below if customer wants auto renewal."
                  id="auto-renew-checkbox"
                  v-model="autorenew_status"
                  name="auto-renew-checkbox"
                  value="true"
                  unchecked-value="false"
                >
                  Automatically Renew The Membership Each Year
                </b-form-checkbox>
              </b-col>
            </b-form-row>

            <div v-if="autorenew_status == 'true' || autorenew_status == true">
              <p v-html="autorenew_disclaimer"></p>
              <p />
            </div>
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
                <span> </span>
              </div>
              <div class="large-6 small-6 columns" style="text-align: right">
                <span class="membership-list-price"> </span>
              </div>
            </div>

            <b-row>
              <b-col>Membership Type Selection</b-col>
              <b-col
                >{{ this.readableCardName(this.CardSelection) + " Card" }}
                <p class="plan">
                  ${{ (Math.round(this.card_price * 100) / 100).toFixed(2) }}
                  per year
                </p>
              </b-col>
            </b-row>

            <b-row v-if="this.promotion_valid">
              <b-col>Promotion Code Applied</b-col>
              <b-col>{{ this.promotion_code }} </b-col>
            </b-row>

            <b-row
              v-if="this.promotion_type__c == 'Percentage Value Promotion'"
            >
              <b-col>Promotion Discount</b-col>
              <b-col
                >{{ this.promotion_value_percentage_discount }}% off
              </b-col>
            </b-row>

            <b-row v-if="this.promotion_type__c == 'Dollar_Value_Promotion'">
              <b-col>Dollar Discount</b-col>
              <b-col
                >- ${{
                  (Math.round(this.promotion_price * 100) / 100).toFixed(2)
                }}
              </b-col>
            </b-row>

            <b-row v-if="this.promotion_type__c == 'Additional_Time_Promotion'">
              <b-col>Additional Time Promotion</b-col>
              <b-col>{{ this.promotion_title }} </b-col>
            </b-row>

            <b-row v-if="TrailerSelection != 'None'">
              <b-col>Trailer Care Selection</b-col>
              <b-col>{{ TrailerSelection }}</b-col>
            </b-row>

            <b-row v-if="TrailerSelection != 'None'">
              <b-col>Trailer Care Price</b-col>
              <b-col
                >+ ${{
                  (Math.round(this.trailering_price * 100) / 100).toFixed(2)
                }}
                per year</b-col
              >
            </b-row>

            <b-row
              v-if="
                this.donation_amount != 0.0 &&
                !this.CardSelection.includes('Trial')
              "
            >
              <b-col>Sea Tow Foundation Donation</b-col>
              <b-col
                >+ ${{ parseFloat(this.donation_amount).toFixed(2) }}</b-col
              >
            </b-row>
            <b-row v-if="this.campaign_state_value">
              <hr />
              <b-col>Campaign Applied</b-col>
              <b-col
                >{{ this.campaign }}
                <p class="desc">
                  {{ this.campaign_desc }}
                </p>
              </b-col>
            </b-row>
            <hr />

            <b-row>
              <b-col>Total Price</b-col>
              <b-col
                >${{
                  (Math.round(this.price_total * 100) / 100).toFixed(2)
                }}</b-col
              >
            </b-row>
          </b-container>
          <!-- <label for="by continuing">
            By continuing, the user verifies that their boats are in good
            working order and understand that Dock-to-Dock tows from the boat’s
            home port to a repair facility, a ramp for haul out or similar, are
            not covered for the first 30 days after membership
            activation.</label
          > -->
        </b-card>
        <p />
        <b-card-group deck>
          <b-card
            header="By hitting SUBMIT you verify that you did the following:"
          >
            <b-list-group>
              <b-list-group-item
                >Verified all boats in good working order</b-list-group-item
              >
              <b-list-group-item
                >Informed customer that membership is effective 24 hours after
                payment received
              </b-list-group-item>
              <b-list-group-item
                >Explained to customer that Dock-to-Dock tows only apply to
                primary vessel after 30 days of membership</b-list-group-item
              >
              <b-list-group-item
                >Informed Customer of Automatic Renewal Program
                Guidelines</b-list-group-item
              >
            </b-list-group>

            <p class="card-text mt-2">
              <b-button type="submit" variant="primary">Submit</b-button>
            </p>
          </b-card>
        </b-card-group>
      </b-form>
    </div>
  </b-container>
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
} from "vuelidate/lib/validators";

import axios from "axios";
import authentication from "../authentication";

axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

export default {
  data() {
    return {
      refTransId: null,
      auth_code: null,
      transId: null,
      cc_declined: false,
      autorenew_disclaimer:
        "<p/>If customer is electing Automatic Renewal you must inform them of the following: <p/><p/>By selecting Automatic Renewal the member authorizes Sea Tow to charge their credit card each year for their selected membership options approximately 10 days prior to their membership renewal date.  The terms and conditions of the Sea Tow Automatic Renewal Program Agreement can be found on seatow.com and will be emailed to them. Prior to each renewal period an email will be sent informing them of the amount and date of the charge. The member can opt out of Automatic Renewal at any time, or make change to their Automatic Renewal subscription, via account management on seatow.com, calling <a href='tel:800-4-SEATOW'>800-4-SEATOW</a> or by emailing <a href='mailto:info@seatow.com'>info@seatow.com</a>",
      donation_amount: 0.0,
      donation_label:
        "Support safer boating by making a donation to the <a href='https://www.seatow.com/tools-and-education/foundation'>Sea Tow Foundation</a>",
      donation_tooltip:
        "Founded in 2007, the Sea Tow Foundation is a public service organization with 501(c)3 nonprofit status whose mission is to promote safe boating practices that directly reduce fatalities, incidents and property damage related to recreational boating.",
      next_year: new Date().getFullYear() + 1,
      selected_trial_time_product: null,
      contacts: {
        firstname: null,
        lastname: null,
        email: null,
        mobilephone: null,
        phone: null,
      },
      account: {
        billingcity: null,
        billingcountry: "United States",
        billingpostalcode: null,
        billingstate: null,
        billingstreet: null,
        shippingcity: null,
        shippingcountry: "United States",
        shippingpostalcode: null,
        shippingstate: null,
        shippingstreet: null,
      },
      boats: {
        color__c: null,
        aor__c: "a0d37000004fpkWAAQ",
        boat_make__c: null,
        boat_status__c: null,
        engine_type__c: "Unspecified",
        fuel_type__c: null,
        hin__c: null,
        home_port_city__c: null,
        home_port_state__c: null,
        home_port_country__c: "United States",
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
      arbs: {
        createddate: null,
        heroku_external_id__c: null,
        name: null,
        pymt__authnet_subscription_id__c: null,
        pymt__amount__c: null,
        pymt__account__c: null,
        pymt__opportunity__r__heroku_external_id__c: null,
        pymt__account__r__heroku_external_id__c: null,
        pymt__billing_city__c: null,
        pymt__billing_company__c: null,
        pymt__billing_country__c: null,
        pymt__billing_email__c: null,
        pymt__billing_first_name__c: null,
        pymt__billing_last_name__c: null,
        pymt__billing_phone__c: null,
        pymt__billing_postal_code__c: null,
        pymt__billing_state__c: null,
        pymt__billing_street__c: null,
        pymt__card_type__c: null,
        pymt__contact__c: null,
        pymt__contact__r__heroku_external_id__c: null,
        pymt__frequency__c: null,
        pymt__last_4_digits__c: null,
        pymt__opportunity__c: null,
        pymt__period__c: null,
        pymt__processor_connection__c: null,
        pymt__subscription_start_date__c: null,
        pymt__subscription_status__c: null,
        pymt__total_occurrences__c: null,
        sfid: null,
        systemmodstamp: null,
      },
      routes: {
        contacts: null,
        boats: null,
        memberships: null,
        account: null,
        arbs: null,
      },
      sfid: {
        contact: null,
        boat: null,
        membership: null,
        account: null,
      },
      campaign: "",
      card_number__c: null,
      card_expiration_month: null,
      card_expiration_year: null,
      promotion_state_value: null,
      campaign_state_value: null,
      campaign_desc: null,
      campaign_good_on: null,
      campaign_sfid: null,
      contact_sfid: null,
      boat_sfid: null,
      membership_sfid: null,
      account_sfid: null,
      renewal: false,
      profile_data: null,
      promotion_value_in_dollars: 0,
      promotion_type__c: null,
      promotion_valid_on_type: null,
      promotion_title: null,
      promotion_value_in_days: null,
      promotion_value_percentage_discount: null,
      promotion_desc: null,
      promotion_code: null,
      promotion_valid: false,
      campaign_valid: false,
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
      boat_length: null,
      boat_make: null,
      boat_doc: null,
      boat_kept_at: null,
      boat_loc_city: null,
      boat_loc_state: null,
      boat_loc_country: null,
      autorenew_status: false,
      funds_collected_locally: false,
      shipping_same_as_billing: true,
      card_price: 179.0,
      card_desc:
        "The choice of over 95% of Sea Tow members. This card provides membership benefits for any recreational vessel that has an engine and is registered to or owned by the member (covered vessels). Any person operating a covered vessel is entitled to receive membership benefits for that vessel. The Gold Card member may also use his/her privileges on any vessel he/she charters, rents, leases or borrows. For complete details on all Gold Card member privileges please see our Membership Agreement.",
      trailering_price: null,
      price_total: 179.0,
      promo_code: null,
      EngineSelection: "Unspecified",
      EngineTypeOptions: [
        { text: "IO", value: "IO" },
        { text: "Outboard", value: "Outboard" },
        { text: "Inboard", value: "Inboard" },
        { text: "Jet", value: "Outboard" },
        { text: "Unspecified", value: "Unspecified" },
      ],
      isHomeportFlorida: false,
      IsHomeportFloridaOptions: [
        { text: "Yes", value: true },
        { text: "No", value: false },
      ],
      CardSelection: "Gold",
      TrialOptions: [
        { text: "60 Day Free Trial", value: "01t37000001DyWg" },
        { text: "95 Day Free Trial", value: "01t37000001DyWq" },
      ],
      TrailerOptions: [
        { text: "Trailer Care Marine - $14.00", value: "Marine", cost: 14.0 },
        {
          text: "Trailer Care Universal - $29.95",
          value: "Universal",
          cost: 29.95,
        },
        { text: "No Roadside Assistance", value: "None", cost: 0.0 },
      ],
      TrailerSelection: "None",
      boat_kept_at_options: [
        { text: "Marina", value: "Marina" },
        { text: "Home Dock", value: "Home Dock" },
        { text: "Trailer", value: "Trailer" },
        { text: "Mooring", value: "Mooring" },
        { text: "Transient", value: "Transient" },
        { text: "Other", value: "Other" },
      ],
      cc_month_options: [
        { text: "January", value: "01" },
        { text: "Feburary", value: "02" },
        { text: "March", value: "03" },
        { text: "April", value: "04" },
        { text: "May", value: "05" },
        { text: "June", value: "06" },
        { text: "July", value: "07" },
        { text: "August", value: "08" },
        { text: "September", value: "09" },
        { text: "October", value: "10" },
        { text: "November", value: "11" },
        { text: "December", value: "12" },
      ],
      country_options: [
        { value: "United States", text: "United States" },
        { value: "Canada", text: "Canada" },
      ],
      boat_state_options: [
        {
          value: "Alabama",
          text: "Alabama",
        },
        {
          value: "Alaska",
          text: "Alaska",
        },
        {
          value: "American Samoa",
          text: "American Samoa",
        },
        {
          value: "Arizona",
          text: "Arizona",
        },
        {
          value: "Arkansas",
          text: "Arkansas",
        },
        {
          value: "California",
          text: "California",
        },
        {
          value: "Colorado",
          text: "Colorado",
        },
        {
          value: "Connecticut",
          text: "Connecticut",
        },
        {
          value: "Delaware",
          text: "Delaware",
        },
        {
          value: "District Of Columbia",
          text: "District Of Columbia",
        },
        {
          value: "Federated States Of Micronesia",
          text: "Federated States Of Micronesia",
        },
        {
          value: "Florida",
          text: "Florida",
        },
        {
          value: "Georgia",
          text: "Georgia",
        },
        {
          value: "Guam",
          text: "Guam",
        },
        {
          value: "Hawaii",
          text: "Hawaii",
        },
        {
          value: "Idaho",
          text: "Idaho",
        },
        {
          value: "Illinois",
          text: "Illinois",
        },
        {
          value: "Indiana",
          text: "Indiana",
        },
        {
          value: "Iowa",
          text: "Iowa",
        },
        {
          value: "Kansas",
          text: "Kansas",
        },
        {
          value: "Kentucky",
          text: "Kentucky",
        },
        {
          value: "Louisiana",
          text: "Louisiana",
        },
        {
          value: "Maine",
          text: "Maine",
        },
        {
          value: "Marshall Islands",
          text: "Marshall Islands",
        },
        {
          value: "Maryland",
          text: "Maryland",
        },
        {
          value: "Massachusetts",
          text: "Massachusetts",
        },
        {
          value: "Michigan",
          text: "Michigan",
        },
        {
          value: "Minnesota",
          text: "Minnesota",
        },
        {
          value: "Mississippi",
          text: "Mississippi",
        },
        {
          value: "Missouri",
          text: "Missouri",
        },
        {
          value: "Montana",
          text: "Montana",
        },
        {
          value: "Nebraska",
          text: "Nebraska",
        },
        {
          value: "Nevada",
          text: "Nevada",
        },
        {
          value: "New Hampshire",
          text: "New Hampshire",
        },
        {
          value: "New Jersey",
          text: "New Jersey",
        },
        {
          value: "New Mexico",
          text: "New Mexico",
        },
        {
          value: "New York",
          text: "New York",
        },
        {
          value: "North Carolina",
          text: "North Carolina",
        },
        {
          value: "North Dakota",
          text: "North Dakota",
        },
        {
          value: "Northern Mariana Islands",
          text: "Northern Mariana Islands",
        },
        {
          value: "Ohio",
          text: "Ohio",
        },
        {
          value: "Oklahoma",
          text: "Oklahoma",
        },
        {
          value: "Oregon",
          text: "Oregon",
        },
        {
          value: "Palau",
          text: "Palau",
        },
        {
          value: "Pennsylvania",
          text: "Pennsylvania",
        },
        {
          value: "Puerto Rico",
          text: "Puerto Rico",
        },
        {
          value: "Rhode Island",
          text: "Rhode Island",
        },
        {
          value: "South Carolina",
          text: "South Carolina",
        },
        {
          value: "South Dakota",
          text: "South Dakota",
        },
        {
          value: "Tennessee",
          text: "Tennessee",
        },
        {
          value: "Texas",
          text: "Texas",
        },
        {
          value: "Utah",
          text: "Utah",
        },
        {
          value: "Vermont",
          text: "Vermont",
        },
        {
          value: "Virgin Islands",
          text: "Virgin Islands",
        },
        {
          value: "Virginia",
          text: "Virginia",
        },
        {
          value: "Washington",
          text: "Washington",
        },
        {
          value: "West Virginia",
          text: "West Virginia",
        },
        {
          value: "Wisconsin",
          text: "Wisconsin",
        },
        {
          value: "Wyoming",
          text: "Wyoming",
        },
      ],
      state_options: [
        {
          text: "Alabama",
          value: "AL",
        },
        {
          text: "Alaska",
          value: "AK",
        },
        {
          text: "American Samoa",
          value: "AS",
        },
        {
          text: "Arizona",
          value: "AZ",
        },
        {
          text: "Arkansas",
          value: "AR",
        },
        {
          text: "California",
          value: "CA",
        },
        {
          text: "Colorado",
          value: "CO",
        },
        {
          text: "Connecticut",
          value: "CT",
        },
        {
          text: "Delaware",
          value: "DE",
        },
        {
          text: "District Of Columbia",
          value: "DC",
        },
        {
          text: "Federated States Of Micronesia",
          value: "FM",
        },
        {
          text: "Florida",
          value: "FL",
        },
        {
          text: "Georgia",
          value: "GA",
        },
        {
          text: "Guam",
          value: "GU",
        },
        {
          text: "Hawaii",
          value: "HI",
        },
        {
          text: "Idaho",
          value: "ID",
        },
        {
          text: "Illinois",
          value: "IL",
        },
        {
          text: "Indiana",
          value: "IN",
        },
        {
          text: "Iowa",
          value: "IA",
        },
        {
          text: "Kansas",
          value: "KS",
        },
        {
          text: "Kentucky",
          value: "KY",
        },
        {
          text: "Louisiana",
          value: "LA",
        },
        {
          text: "Maine",
          value: "ME",
        },
        {
          text: "Marshall Islands",
          value: "MH",
        },
        {
          text: "Maryland",
          value: "MD",
        },
        {
          text: "Massachusetts",
          value: "MA",
        },
        {
          text: "Michigan",
          value: "MI",
        },
        {
          text: "Minnesota",
          value: "MN",
        },
        {
          text: "Mississippi",
          value: "MS",
        },
        {
          text: "Missouri",
          value: "MO",
        },
        {
          text: "Montana",
          value: "MT",
        },
        {
          text: "Nebraska",
          value: "NE",
        },
        {
          text: "Nevada",
          value: "NV",
        },
        {
          text: "New Hampshire",
          value: "NH",
        },
        {
          text: "New Jersey",
          value: "NJ",
        },
        {
          text: "New Mexico",
          value: "NM",
        },
        {
          text: "New York",
          value: "NY",
        },
        {
          text: "North Carolina",
          value: "NC",
        },
        {
          text: "North Dakota",
          value: "ND",
        },
        {
          text: "Northern Mariana Islands",
          value: "MP",
        },
        {
          text: "Ohio",
          value: "OH",
        },
        {
          text: "Oklahoma",
          value: "OK",
        },
        {
          text: "Oregon",
          value: "OR",
        },
        {
          text: "Palau",
          value: "PW",
        },
        {
          text: "Pennsylvania",
          value: "PA",
        },
        {
          text: "Puerto Rico",
          value: "PR",
        },
        {
          text: "Rhode Island",
          value: "RI",
        },
        {
          text: "South Carolina",
          value: "SC",
        },
        {
          text: "South Dakota",
          value: "SD",
        },
        {
          text: "Tennessee",
          value: "TN",
        },
        {
          text: "Texas",
          value: "TX",
        },
        {
          text: "Utah",
          value: "UT",
        },
        {
          text: "Vermont",
          value: "VT",
        },
        {
          text: "Virgin Islands",
          value: "VI",
        },
        {
          text: "Virginia",
          value: "VA",
        },
        {
          text: "Washington",
          value: "WA",
        },
        {
          text: "West Virginia",
          value: "WV",
        },
        {
          text: "Wisconsin",
          value: "WI",
        },
        {
          text: "Wyoming",
          value: "WY",
        },
      ],
      membership_number__c: "",
      isRenew: false,
      search_type: null,
      response_data: [],
      full_data: [],
      isBusy: false,
      tableFields: [
        {
          label: "Fill Data",
          key: "show_details",
          sortable: false,
        },
        {
          label: "Memb. Number",
          key: "membership_number__c",
          sortable: false,
        },
        {
          label: "Account Name",
          key: "account_name__c",
          sortable: false,
        },
        {
          label: "Phone Number",
          key: "phone",
          sortable: false,
        },
        {
          label: "Cell Number",
          key: "mobilephone",
          sortable: false,
        },
        {
          label: "Email",
          key: "email",
          sortable: false,
        },
        {
          label: "Status",
          key: "membership_status__c",
          sortable: false,
        },
        {
          label: "Exp. Date",
          key: "membership_expiration_date__c",
          sortable: false,
        },
      ],
    };
  },
  validations: {
    donation_amount: {},
    selected_trial_time_product: {
      required: requiredIf(function () {
        return this.CardSelection.includes("Trial");
      }),
    },
    campaign: {},
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
        required: requiredIf(function () {
          return !this.shipping_same_as_billing;
        }),
      },
      shippingcountry: {
        required: requiredIf(function () {
          return !this.shipping_same_as_billing;
        }),
      },
      shippingpostalcode: {
        required: requiredIf(function () {
          return !this.shipping_same_as_billing;
        }),
      },
      shippingstate: {
        required: requiredIf(function () {
          return !this.shipping_same_as_billing;
        }),
      },
      shippingstreet: {
        required: requiredIf(function () {
          return !this.shipping_same_as_billing;
        }),
      },
      acc_name_vald: {},
    },
    boats: {
      color__c: {},
      engine_type__c: {},
      marina_name__c: {
        required,
      },
      year__c: {
        required,
        minLength: minLength(4),
        maxLength: maxLength(4),
        integer,
        between: between(1900, 2022),
      },
      length__c: {
        required,
        integer,
        maxLength: maxLength(2),
        between: between(1, 65),
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
    card_expiration_month: {},
    card_expiration_year: {},
    memberships: {
      card_number__c: {
        integer,
      },
      card_security_code__c: {
        integer,
      },
    },
    membership_number__c: {
      integer,
    },
    promotion_code: {},
  },
  computed: {
    marina_desc() {
      if (this.boats.home_port_type__c == null) {
        return "Please select where your boat is kept above.";
      }
      var marina_dict = {};
      marina_dict["Marina"] = "Name of marina where boat is kept:";
      marina_dict["Trailer"] = "Boat ramp most frequently used:";
      marina_dict["Mooring"] = "Body of water / Mooring location:";
      marina_dict["Home Dock"] = "Address of home dock:";
      marina_dict["Transient"] = "Please describe in more detail:";
      marina_dict["Other"] = "Please describe in more detail:";

      return marina_dict[this.boats.home_port_type__c];
    },
    authnet_expiration() {
      return `${this.card_expiration_month}/${this.card_expiration_year}`;
    },
    current_year_add_one() {
      return new Date().getFullYear() + 1;
    },
    cc_year_options() {
      var min = new Date().getFullYear(),
        max = min + 9;

      var years = [];

      for (var i = min; i <= max; i++) {
        years.push({ text: `${i}`, value: `${i}` });
      }

      return years;
    },
    account_name: {
      get: function () {
        var a = this.contacts.firstname + " " + this.contacts.lastname;
        return a.replaceAll("null", "");
      },
      set: function () {
        this.account.acc_name_data =
          this.contacts.firstname + " " + this.contacts.lastname;
      },
    },
    promotionstate() {
      return this.promotion_state_value;
    },
    promotionFeedback() {
      if (!this.promotion_valid) {
        return "This promotion code is not valid.";
      }

      return "Enter a valid promotion code, if applicable.";
    },
    campaignstate() {
      return this.campaign_state_value;
    },
    campaignFeedback() {
      if (!this.campaign_valid) {
        return "This campaign code is not valid.";
      }

      return "Enter a valid promotion code, if applicable.";
    },
    CardOptions() {
      return [
        {
          text: "Gold Card - $179.00",
          value: "Gold",
          cost: 179.0,
          title:
            "The choice of over 95% of Sea Tow members. This card provides membership benefits for any recreational vessel that has an engine and is registered to or owned by the member (covered vessels). Any person operating a covered vessel is entitled to receive membership benefits for that vessel. The Gold Card member may also use his/her privileges on any vessel he/she charters, rents, leases or borrows. For complete details on all Gold Card member privileges please see our Membership Agreement.",
        },
        {
          text: "Lake Card - $119.00",
          value: "Lake",
          cost: 119.0,
          disabled: this.$data.isHomeportFlorida,
          title:
            "If you boat on fresh, non-tidal, inland waterways (excluding Florida) then the Lake Card may be the perfect option for you. The Sea Tow Lake Card provides the same member benefits as the Gold Card, but on ALL fresh, non-tidal, inland waterways. For complete details on all Lake Card member privileges please see our Membership Agreement.",
        },
        {
          text: "Commerical Card - $179.00",
          value: "Commercial",
          cost: 179.0,
          title:
            "This card provides service for commercial vessels. The Commercial Card covers the primary vessel only. Any person operating the primary vessel is entitled to receive all membership benefits for that vessel at $100 per hour.",
        },
        {
          text: "Prof. Mariner Card - $365.00",
          value: "ProfMariner",
          cost: 365.0,
          title:
            "If you make your living on the water, this card is for you. The Professional Mariner Card is a service package for individuals who regularly use multiple vessels in the performance of their maritime duties such as: yacht delivery captains, on-water instructors, etc. Any vessel the member is operating and is the master of, is entitled to receive membership benefits for that vessel, except Dock-to-Dock Tows.",
        },
        {
          text: "Trial - Promote Gold Card - $0.00",
          value: "TrialGold",
          cost: 0.0,
          title:
            "The choice of over 95% of Sea Tow members. This card provides membership benefits for any recreational vessel that has an engine and is registered to or owned by the member (covered vessels). Any person operating a covered vessel is entitled to receive membership benefits for that vessel. The Gold Card member may also use his/her privileges on any vessel he/she charters, rents, leases or borrows. For complete details on all Gold Card member privileges please see our Membership Agreement.",
        },
        {
          text: "Trial - Promote Lake Card - $0.00",
          value: "TrialLake",
          cost: 0.0,
          title:
            "The choice of over 95% of Sea Tow members. This card provides membership benefits for any recreational vessel that has an engine and is registered to or owned by the member (covered vessels). Any person operating a covered vessel is entitled to receive membership benefits for that vessel. The Gold Card member may also use his/her privileges on any vessel he/she charters, rents, leases or borrows. For complete details on all Gold Card member privileges please see our Membership Agreement.",
        },
      ];
    },
  },
  methods: {
    stripTheGarbage(e) {
      if ((e.keyCode < 48 && e.keyCode !== 46) || e.keyCode > 59) {
        e.preventDefault();
      }
    },
    stripNonAlpha(e) {
      if (/^[a-zA-Z ]+$/i.test(e.key) == false) {
        e.preventDefault();
      }
    },
    readableCardName(name) {
      if (name == "ProfMariner") {
        return "Professional Mariner";
      } else if (~name.indexOf("Trial")) {
        var split_name = name.split("Trial");
        return name.substring(0, 5) + " " + split_name[1];
      }
      return name;
    },
    formatDollars() {
      if (this.donation_amount != "") {
        var num = this.donation_amount;
        num = Number(num);

        var countDecimals = function (value) {
          if (Math.floor(value) === value) return 0;
          return value.toString().split(".")[1].length || 0;
        };

        var decimal = countDecimals(num);

        if (decimal < 2) {
          num = num.toFixed(2);
        }

        if (decimal > 2) {
          num = num.toFixed(decimal);
        }

        if (parseInt(num) < 1) {
          num = "." + String(num).split(".")[1];
        }

        this.donation_amount = parseFloat(num);
        this.updateCartPrice();
      }
    },
    logOut() {
      authentication.signOut();
    },
    abbrRegion(input, to) {
      var states = [
        ["Alabama", "AL"],
        ["Alaska", "AK"],
        ["American Samoa", "AS"],
        ["Arizona", "AZ"],
        ["Arkansas", "AR"],
        ["Armed Forces Americas", "AA"],
        ["Armed Forces Europe", "AE"],
        ["Armed Forces Pacific", "AP"],
        ["California", "CA"],
        ["Colorado", "CO"],
        ["Connecticut", "CT"],
        ["Delaware", "DE"],
        ["District Of Columbia", "DC"],
        ["Florida", "FL"],
        ["Georgia", "GA"],
        ["Guam", "GU"],
        ["Hawaii", "HI"],
        ["Idaho", "ID"],
        ["Illinois", "IL"],
        ["Indiana", "IN"],
        ["Iowa", "IA"],
        ["Kansas", "KS"],
        ["Kentucky", "KY"],
        ["Louisiana", "LA"],
        ["Maine", "ME"],
        ["Marshall Islands", "MH"],
        ["Maryland", "MD"],
        ["Massachusetts", "MA"],
        ["Michigan", "MI"],
        ["Minnesota", "MN"],
        ["Mississippi", "MS"],
        ["Missouri", "MO"],
        ["Montana", "MT"],
        ["Nebraska", "NE"],
        ["Nevada", "NV"],
        ["New Hampshire", "NH"],
        ["New Jersey", "NJ"],
        ["New Mexico", "NM"],
        ["New York", "NY"],
        ["North Carolina", "NC"],
        ["North Dakota", "ND"],
        ["Northern Mariana Islands", "NP"],
        ["Ohio", "OH"],
        ["Oklahoma", "OK"],
        ["Oregon", "OR"],
        ["Pennsylvania", "PA"],
        ["Puerto Rico", "PR"],
        ["Rhode Island", "RI"],
        ["South Carolina", "SC"],
        ["South Dakota", "SD"],
        ["Tennessee", "TN"],
        ["Texas", "TX"],
        ["US Virgin Islands", "VI"],
        ["Utah", "UT"],
        ["Vermont", "VT"],
        ["Virginia", "VA"],
        ["Washington", "WA"],
        ["West Virginia", "WV"],
        ["Wisconsin", "WI"],
        ["Wyoming", "WY"],
      ];

      var provinces = [
        ["Alberta", "AB"],
        ["British Columbia", "BC"],
        ["Manitoba", "MB"],
        ["New Brunswick", "NB"],
        ["Newfoundland", "NF"],
        ["Northwest Territory", "NT"],
        ["Nova Scotia", "NS"],
        ["Nunavut", "NU"],
        ["Ontario", "ON"],
        ["Prince Edward Island", "PE"],
        ["Quebec", "QC"],
        ["Saskatchewan", "SK"],
        ["Yukon", "YT"],
      ];

      var regions = states.concat(provinces);

      var i;
      if (to == "abbr") {
        input = input.replace(/\w\S*/g, function (txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
        for (i = 0; i < regions.length; i++) {
          if (regions[i][0] == input) {
            return regions[i][1];
          }
        }
      } else if (to == "name") {
        input = input.toUpperCase();
        for (i = 0; i < regions.length; i++) {
          if (regions[i][1] == input) {
            return regions[i][0];
          }
        }
      }
    },
    async submitSearchForm() {
      this.$bvToast.toast(
        `Searching using '${this.membership_number__c}' as criteria.`,
        {
          title: "Searching for member",
          autoHideDelay: 2000,
        }
      );

      let data = {
        search_term: this.membership_number__c,
        search_type: this.search_type,
      };
      axios
        .post(
          `${process.env.VUE_APP_APIURL}/${process.env.VUE_APP_APIVER}/utility/search/`,
          data
        )
        .then((response) => {
          console.log(response);
          response["data"].forEach(
            (element) => (element["show_details"] = false)
          );
          this.toggleBusy();
          this.response_data = response["data"];
          if (this.response_data.length > 0) {
            this.$bvToast.toast(
              `Found ${this.response_data.length} possible ${
                this.response_data.length > 1 ? "matches" : "match"
              }.`,
              {
                title: "Matches found.",
                autoHideDelay: 5000,
              }
            );
          } else {
            this.$bvToast.toast(
              "No matches, nothing to display. Try refining your search criteria.",
              {
                title: "No matches found.",
                autoHideDelay: 5000,
              }
            );
          }
        });
    },
    clearTable() {
      this.response_data = [];
      this.membership_number__c = "";
    },
    clearForm() {
      var contact_parsed_obj = JSON.parse(JSON.stringify(this.contacts));
      var contact_keynames = Object.keys(contact_parsed_obj);
      var account_parsed_obj = JSON.parse(JSON.stringify(this.account));
      var account_keynames = Object.keys(account_parsed_obj);
      var boats_parsed_obj = JSON.parse(JSON.stringify(this.boats));
      var boats_keynames = Object.keys(boats_parsed_obj);
      var memberships_parsed_obj = JSON.parse(JSON.stringify(this.memberships));
      var memberships_keynames = Object.keys(memberships_parsed_obj);

      contact_keynames.forEach((name) => {
        this.contacts[name] = null;
      });

      account_keynames.forEach((name) => {
        this.account[name] = null;
      });

      boats_keynames.forEach((name) => {
        this.boats[name] = null;
      });

      memberships_keynames.forEach((name) => {
        this.memberships[name] = null;
      });

      this.isHomeportFlorida = false;
      this.CardSelection = "Gold";
      this.TrailerSelection = "None";
      this.isRenew = false;
      this.account.billingstate = null;

      //Clear promotion code information
      this.promotion_title = null;
      this.promotion_value_percentage_discount = null;
      this.promotion_sfid = null;
      this.promotion_valid_on_business_type__c = null;
      this.promotion_state_value = null;
      this.promotion_valid = false;
      this.promotion_price = 0;
      this.promotion_type__c = null;
      this.title__c = null;
      this.promotion_value_in_dollars = null;
      this.promotion_value_in_days = null;
      this.promotion_code = null;
      this.promotion_details__c = null;
      this.promotion_desc = null;
      this.price_total = 179.0;
      this.donation_amount = 0;
      this.cc_declined = false;
      this.refTransId = null;

      this.$bvToast.toast("Data has been cleared from the form.", {
        title: "Data cleared",
        autoHideDelay: 5000,
      });
    },

    toggleBusy() {
      this.isBusy = !this.isBusy;
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
        var p = (Math.random().toString(16) + "000000000").substr(2, 8);
        return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
      }
      return _p8() + _p8(true) + _p8(true) + _p8();
    },
    RenewMembership(row, index, detailsShowing) {
      if (!detailsShowing) {
        row.toggleDetails();
        let data = {
          accountid: this.response_data[index]["account__c"],
        };

        axios
          .post(
            `${process.env.VUE_APP_APIURL}/${process.env.VUE_APP_APIVER}/utility/getallinfo/`,
            data
          )
          .then((response) => {
            this.response_data[index]["full_data"] = response["data"];
            console.log(response["data"])
          })
          .then(() => {
            var contact_parsed_obj = JSON.parse(JSON.stringify(this.contacts));
            var contact_keynames = Object.keys(contact_parsed_obj);

            var boat_parsed_obj = JSON.parse(JSON.stringify(this.boats));
            var boat_keynames = Object.keys(boat_parsed_obj);

            var account_parsed_obj = JSON.parse(JSON.stringify(this.account));
            var account_keynames = Object.keys(account_parsed_obj);

            var membership_parsed_obj = JSON.parse(
              JSON.stringify(this.memberships)
            );
            var membership_keynames = Object.keys(membership_parsed_obj);

            var arbs_parsed_obj = JSON.parse(JSON.stringify(this.arbs));
            var arbs_keynames = Object.keys(arbs_parsed_obj);

            this.contact_sfid = this.response_data[index]["full_data"][
              "contacts"
            ][0]["sfid"];
            this.routes.contact = this.contact_sfid;
            contact_keynames.forEach((name) => {
              if(name.includes("phone")) {
                console.log(this.response_data[index]["full_data"]["contacts"][0][name])
                if (this.response_data[index]["full_data"]["contacts"][0][name] != null) {
                  this.response_data[index]["full_data"]["contacts"][0][name] = this.response_data[index]["full_data"]["contacts"][0][name].replace( /[^0-9]/g, '' );
                }
              }
              this.contacts[name] = this.response_data[index]["full_data"][
                "contacts"
              ][0][name];
            });

            console.log("account");
            this.account_sfid = this.response_data[index]["full_data"][
              "account"
            ][0]["sfid"];
            this.routes.account = this.account_sfid;
            account_keynames.forEach((name) => {
              this.account[name] = this.response_data[index]["full_data"][
                "account"
              ][0][name];
            });

            this.boat_sfid = this.response_data[index]["full_data"]["boats"][0][
              "sfid"
            ];
            this.routes.boat = this.boat_sfid;
            boat_keynames.forEach((name) => {
              this.boats[name] = this.response_data[index]["full_data"][
                "boats"
              ][0][name];
            });

            this.membership_sfid = this.response_data[index]["full_data"][
              "memberships"
            ][0]["sfid"];
            this.routes.membership = this.membership_sfid;
            membership_keynames.forEach((name) => {
              this.memberships[name] = this.response_data[index]["full_data"][
                "memberships"
              ][0][name];
            });

            if (
              this.response_data[index]["full_data"]["arbs"]["Error"] !==
              undefined
            ) {
              if (
                this.response_data[index]["full_data"]["arbs"]["Error"] ==
                "No pymt__payment_profile__c found with specified ID"
              ) {
                //no ARB found, nothing to do with it
                console.log("no arb found for user");
              } else {
                //ARB found, populate data so if they renew the member, they can cancel it
                this.arbs_sfid = this.response_data[index]["full_data"][
                  "arbs"
                ][0]["sfid"];
                this.routes.arbs = this.arbs_sfid;
                arbs_keynames.forEach((name) => {
                  //save all arb data in session
                  this.arbs[name] = this.response_data[index]["full_data"][
                    "arbs"
                  ][0][name];
                });
              }
            } else {
              console.log("no arb found");
            }

            if (this.account.shippingstreet == this.account.billingstreet) {
              this.shipping_same_as_billing = true;
            } else {
              this.shipping_same_as_billing = false;
            }
            this.isRenew = !this.isRenew;
            this.$bvToast.toast(
              "The form has been populated with the member's information.",
              {
                title: "Data populated.",
                autoHideDelay: 5000,
              }
            );
          });
      } else {
        this.detailsShowing = false;
      }
    },
    ExpandAndShowData(row, index, detailsShowing) {
      if (!detailsShowing) {
        let data = {
          accountid: this.response_data[index]["account__c"],
        };

        axios
          .post(
            `${process.env.VUE_APP_APIURL}/${process.env.VUE_APP_APIVER}/utility/getallinfo/`,
            data
          )
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

      axios
        .post(
          `${process.env.VUE_APP_APIURL}/${process.env.VUE_APP_APIVER}/leads/`,
          data
        )
        .then((response) => {
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

      axios
        .post(
          `${process.env.VUE_APP_APIURL}/${process.env.VUE_APP_APIVER}/auth`,
          data
        )
        .then((response) => {
          this.access_token = response.data.access_token;
          return response.data.access_token;
        });
    },
    preventDisabledAndChecked(isHomeportInFlorida) {
      if (isHomeportInFlorida && this.$data.CardSelection == "Lake") {
        document.getElementById(
          "card-selection-radio_BV_option_0"
        ).checked = true;

        // document.getElementById(
        //   "carddescription"
        // ).innerHTML = this.CardOptions[0].title;

        this.CardSelection = "Gold";
        this.updateCartPrice("Gold");

        this.$bvToast.toast("You can't have a Lake Card in Florida.", {
          title: "Invalid selections.",
          autoHideDelay: 5000,
        });
      }
    },
    async submitPromo(promotion) {
      this.$bvToast.toast(
        `We're searching for the promotion code ${promotion}`,
        {
          title: "Searching for promotions",
          autoHideDelay: 2000,
        }
      );

      axios
        .post(
          `${process.env.VUE_APP_APIURL}/${process.env.VUE_APP_APIVER}/utility/promos/`,
          {
            promotion_code: promotion,
          }
        )
        .then(
          (response) => {
            if (response.data != null) {
              if ("Error" in response.data) {
                if (
                  response.data["Error"].localeCompare(
                    "No active promotion codes found with the provided promo code."
                  ) == 0
                ) {
                  this.promotion_state_value = false;
                  this.$bvToast.toast(`${promotion} was not found.`, {
                    title: "Promotion code not found",
                    autoHideDelay: 5000,
                  });
                } else if (
                  response.data["Error"].localeCompare(
                    "The promotion code is no longer active."
                  ) != 0
                ) {
                  this.promotion_state_value = false;
                  this.$bvToast.toast(
                    "This promotion code is either no longer active, or not applicable to the current membership.",
                    {
                      title: "Invalid promotion code.",
                      autoHideDelay: 5000,
                    }
                  );
                }
              } else {
                this.$bvToast.toast(
                  `We've found ${promotion}. The type is: ${response.data["promotion_type__c"]}`,
                  {
                    title: "Promotion found!",
                    autoHideDelay: 5000,
                  }
                );

                console.log(response.data);
                this.promotion_valid_on_business_type__c =
                  response.data["valid_on_business_type__c"];
                this.promotion_state_value = true;
                this.promotion_sfid = response.data["sfid"];
                this.promotion_valid = true;
                this.promotion_value_in_days =
                  response.data["value_time_in_days__c"];
                this.promotion_price =
                  response.data["value_discount_in_dollars__c"];
                this.promotion_value_in_dollars =
                  response.data["value_discount_in_dollars__c"];
                this.promotion_value_percentage_discount =
                  response.data["value_discount_in_percentage__c"];
                this.promotion_type__c = response.data["promotion_type__c"];
                this.promotion_desc = response.data["promotion_details__c"];
                this.promotion_title = response.data["title__c"];
                this.updateCartPrice();
              }
            }
          },
          (error) => {
            console.log(error);
          }
        );
    },
    async submitCampaign(campaign) {
      this.$bvToast.toast(`We're searching for the campaign code ${campaign}`, {
        title: "Searching for campaigns",
        autoHideDelay: 2000,
      });

      axios
        .post(
          `${process.env.VUE_APP_APIURL}/${process.env.VUE_APP_APIVER}/utility/campaigns/`,
          {
            campaign_name: campaign,
          }
        )
        .then(
          (response) => {
            console.log(response);
            if (response.data != null) {
              if ("Error" in response.data) {
                if (
                  response.data["Error"].localeCompare(
                    "No campaign found with the ID."
                  ) == 0
                ) {
                  this.campaign_state_value = false;
                  this.$bvToast.toast(`${campaign} was not found.`, {
                    title: "Campaign not found",
                    autoHideDelay: 5000,
                  });
                } else if (
                  response.data["Error"].localeCompare(
                    "No campaign found with the ID."
                  ) != 0
                ) {
                  console.log(response);
                  this.$bvToast.toast(
                    "This promotion code is either no longer active, or not applicable to the current membership.",
                    {
                      title: "Invalid promotion code.",
                      autoHideDelay: 5000,
                    }
                  );
                }
              } else {
                this.$bvToast.toast(`We've found '${campaign}'.`, {
                  title: "Campaign found!",
                  autoHideDelay: 5000,
                });
                this.campaign_state_value = true;
                this.campaign_desc = response.data["name"];
                this.campaign_good_on =
                  response.data["good_on_invoice_type__c"];
                this.campaign_sfid = response.data["sfid"];
              }
            }
          },
          (error) => {
            console.log(error);
          }
        );
    },
    resetCampaignDetails() {
      (this.campaign_good_on = null),
        (this.campaign_desc = null),
        (this.campaign = "");
      this.campaign_state_value = null;
      this.updateCartPrice();

      this.$bvToast.toast("Campaign cleared from the form.", {
        title: "Campaign cleared",
        autoHideDelay: 3000,
      });
    },
    resetPromotionDetails() {
      this.promotion_title = null;
      this.promotion_value_percentage_discount = null;
      this.promotion_sfid = null;
      this.promotion_valid_on_business_type__c = null;
      this.promotion_state_value = null;
      this.promotion_valid = false;
      this.promotion_price = 0;
      this.promotion_type__c = null;
      this.title__c = null;
      this.promotion_value_in_dollars = null;
      this.promotion_value_in_days = null;
      this.promotion_code = null;
      this.promotion_details__c = null;
      this.promotion_desc = null;
      this.updateCartPrice();

      this.$bvToast.toast("Promotion code cleared from the form.", {
        title: "Promotion cleared",
        autoHideDelay: 3000,
      });
    },
    async submitForm() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.cc_declined = false;
        this.memberships.auto_renew__c = this.isRenew;
        if (
          //if it's a lead
          this.price_total == 0 ||
          this.CardSelection == "TrialLake" ||
          this.CardSelection == "TrialGold"
        ) {
          var selectedTrialFullProduct = null;
          if (this.CardSelection == "TrialLake") {
            selectedTrialFullProduct = "01t37000000YWRW";
          } else {
            selectedTrialFullProduct = "01t37000000YWRM";
          }
          let headers = {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          };

          let lead_data = {
            lastname: this.contacts.lastname,
            company: this.account_name,
            status: "Open",
            home_port_type__c: this.boats.home_port_type__c,
            aor__c: "a0d37000004fpm9AAA",
            lead_product__c: this.selected_trial_time_product,
            lead_full_product__c: selectedTrialFullProduct,
            fuel_type__c: this.boats.fuel_type__c,
            registration_document__c: this.boats.registration_document__c,
            state: this.account.shippingstate,
            city: this.account.shippingcity,
            street: this.account.shippingstreet,
            country: this.account.shippingcountry,
            postalcode: this.account.postalcode,
            year__c: this.boats.year__c,
            home_port_country__c: this.boats.home_port_country__c,
            home_port_state__c: this.boats.home_port_state__c,
            home_port_city__c: this.boats.home_port_city__c,
            boat_make__c: this.boats.boat_make__c,
            email: this.contacts.email,
            length__c: this.boats.length__c,
            phone: this.contacts.phone,
            mobilephone: this.contacts.mobilephone,
          };

          console.log(lead_data);
          axios({
            method: "post",
            url: `${process.env.VUE_APP_APIURL}/${process.env.VUE_APP_APIVER}/leads/`,
            data: lead_data,
            headers: headers,
          }).then((response) => {
            // insert toast letting user know lead was inserted
            console.log(response);
          });
        } else {
          //else it's a full member
          if (
            this.shipping_same_as_billing == "true" ||
            this.shipping_same_as_billing == true
          ) {
            this.account.shippingstreet = this.account.billingstreet;
            this.account.shippingstate = this.account.billingstate;
            this.account.shippingcity = this.account.billingcity;
            this.account.shippingpostalcode = this.account.billingpostalcode;
            this.account.shippingcountry = this.account.billingcountry;
          }

          let headers = {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          };

          const opp_guid = this.guid();
          //AUTHORIZE regardelss if it's a renew or a join...
          let authorize_data = {};
          authorize_data["uid"] = "unique-identifier";
          authorize_data["cc_number"] = this.memberships.card_number__c;
          authorize_data["exp_date"] = this.authnet_expiration;
          authorize_data["ccv"] = this.memberships.card_security_code__c;
          authorize_data["first_name"] = this.contacts.firstname;
          authorize_data["last_name"] = this.contacts.lastname;
          authorize_data["amount"] = (
            Math.round(this.price_total * 100) / 100
          ).toFixed(2);
          authorize_data["email"] = this.contacts.email;
          authorize_data["street_address"] = this.account.billingstreet;
          authorize_data["city"] = this.account.billingcity;
          authorize_data["state"] = this.account.billingstate;
          authorize_data["zip"] = this.account.billingpostalcode;
          authorize_data["country"] = this.account.billingcountry;
          authorize_data["company"] = "";
          authorize_data["uuid"] = opp_guid;
          authorize_data["order_desc"] = "Payment via Membership App";

          console.log(authorize_data);

          axios({
            method: "post",
            url: `${process.env.VUE_APP_APIURL}/${process.env.VUE_APP_APIVER}/authorizenet/authorize/`,
            data: authorize_data,
            headers: headers,
          })
            .then((response) => {
              console.log(response);
              if (response["data"]["status"] == "error") {
                console.log("transaction declined");

                this.$bvToast.toast(`${response["data"]["message"]}`, {
                  title: "There was an error processing payment.",
                  autoHideDelay: 5000,
                });

                this.cc_declined = true;
                return;
              } else {
                this.refTransId = response['data']['transId']
                this.$bvToast.toast(`${response["message"]}`, {
                  title:
                    "Card successfully authorized. Proceeding with account creation.",
                  autoHideDelay: 5000,
                });
                
                this.cc_declined = false;
              }

              // get transid and authid
              console.log(response);

              // this.auth_code = response["data"]["auth_code"];
              // this.transId = response["data"]["transId"];
            })
            .then(() => {
              //cancel existing ARB if they don't want it in SALESFORCE
              console.log(`this.arbs.sfid = ${this.arbs.sfid}`);
              if (!this.autorenew_status && this.arbs.sfid !== null) {
                data = {};
                data["sfid"] = this.arbs.sfid;
                axios({
                  method: "patch",
                  url: `${process.env.VUE_APP_APIURL}/${process.env.VUE_APP_APIVER}/authorizenet/arb/`,
                  data: data,
                  headers: headers,
                }).then((response) => {
                  if (response["data"]["response"] != "success") {
                    console.log(
                      "something went wrong when trying to cancel the existing ARB in auth.net"
                    );
                  } else {
                    console.log(`arb succesfully cancelled`);
                  }
                });
              }

              if (this.cc_declined == false) {

              if (this.autorenew_status) {
                console.log("it's a renewal, check existing ARB");
                //if auto-renew is checked, check to see if ARB is active, if it is cancel old ARB then create new ARB
                if (this.arbs.sfid !== undefined) {
                  //cancel ARB in salesforce
                  if (this.arbs.pymt__subscription_status__c == "Active") {
                    var data = {};
                    data[
                      "subscriptionId"
                    ] = this.arbs.pymt__authnet_subscription_id__c;
                    axios({
                      method: "delete",
                      url: `${process.env.VUE_APP_APIURL}/${process.env.VUE_APP_APIVER}/authorizenet/arb/`,
                      data: arb_data,
                      headers: headers,
                    }).then((response) => {
                      if (response["data"]["response"] != "success") {
                        console.log(
                          "something went wrong when trying to cancel the existing ARB in auth.net"
                        );
                      } else {
                        console.log(`arb succesfully cancelled`);
                      }
                    });
                  }
                } else {
                  console.log(
                    "ARB Status is not active, so no need to cancel."
                  );
                }

                //then create new arb
                let arb_data = {};
                arb_data["sub_name"] =
                  "ARB Subscription Profile - Membership App";
                arb_data["cc_number"] = this.memberships.card_number__c;
                arb_data["exp_date"] = this.authnet_expiration;
                arb_data["ccv"] = this.memberships.card_security_code__c;
                arb_data["first_name"] = this.contacts.firstname;
                arb_data["last_name"] = this.contacts.lastname;
                arb_data["uuid"] = opp_guid;
                arb_data["amount"] = (
                  Math.round(this.price_total * 100) / 100
                ).toFixed(2);
                arb_data["trial_amount"] = "0";
                //pass existing expiration date
                //pass promotion number of days

                axios({
                  method: "post",
                  url: `${process.env.VUE_APP_APIURL}/${process.env.VUE_APP_APIVER}/authorizenet/arb/`,
                  data: arb_data,
                  headers: headers,
                });
              }

              let headers = {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods":
                  "GET,PUT,POST,DELETE,PATCH,OPTIONS",
              };

              var account_parsed_obj = JSON.parse(JSON.stringify(this.account));
              var account_keynames = Object.keys(account_parsed_obj);

              var contact_parsed_obj = JSON.parse(
                JSON.stringify(this.contacts)
              );
              var contact_keynames = Object.keys(contact_parsed_obj);

              var boat_parsed_obj = JSON.parse(JSON.stringify(this.boats));
              var boat_keynames = Object.keys(boat_parsed_obj);

              var membership_parsed_obj = JSON.parse(
                JSON.stringify(this.memberships)
              );
              var membership_keynames = Object.keys(membership_parsed_obj);


              


                

              data = {};

              if (this.isRenew) {
                console.log("starting renewal");
                console.log("headers");
                console.log(headers);
                this.$bvToast.toast("Starting the renewal process.", {
                  title: "Starting renewal.",
                  autoHideDelay: 5000,
                });
                var sfid_parsed_obj = JSON.parse(JSON.stringify(this.routes));
                var sfid_keynames = Object.keys(sfid_parsed_obj);

                data = {};
                sfid_keynames.forEach((field) => {
                  if (field == "account") {
                    field = "accounts";
                    account_keynames.forEach((field) => {
                      data[field] = account_parsed_obj[field];
                    });

                    data["sfid"] = this.account_sfid;
                  } else if (field == "boats") {
                    boat_keynames.forEach((field) => {
                      data[field] = boat_parsed_obj[field];
                    });
                    data["sfid"] = this.boat_sfid;
                  } else if (field == "memberships") {
                    membership_keynames.forEach((field) => {
                      data[field] = membership_parsed_obj[field];
                    });
                    data["sfid"] = this.membership_sfid;
                  } else if (field == "contacts") {
                    contact_keynames.forEach((field) => {
                      data[field] = contact_parsed_obj[field];
                    });
                    data["sfid"] = this.contact_sfid;
                  }

                  axios({
                    method: "patch",
                    url: `${process.env.VUE_APP_APIURL}/${process.env.VUE_APP_APIVER}/${field}/`,
                    data: data,
                    headers: headers,
                  })
                    .then((response) => {
                      console.log(response);
                    })
                    .catch(function (error) {
                      this.$bvToast.toast(
                        `The following error occured: ${error}`,
                        {
                          title: "An Error Occured",
                          autoHideDelay: 5000,
                        }
                      );
                    });

                  data = {};
                });

                this.$bvToast.toast("Update successful.", {
                  title: "Renewal successful.",
                  autoHideDelay: 5000,
                });
              } else {
                console.log("starting new submission");
                const acc_guid = this.guid();
                data["heroku_external_id__c"] = acc_guid;
                data["account_detail_type__c"] = "Customer - Retail";
                data["type"] = "General";
                data["name"] = this.account_name;
                data["recordtypeid"] = "01237000000Tgx2AAC";
                account_keynames.forEach((field) => {
                  data[field] = account_parsed_obj[field];
                });

                axios({
                  method: "post",
                  url: `${process.env.VUE_APP_APIURL}/${process.env.VUE_APP_APIVER}/accounts/`,
                  data: data,
                  headers: headers,
                }).then((response) => {
                  data = {};

                  if (!("error" in response)) {
                    const cont_guid = this.guid();
                    data["account__heroku_external_id__c"] = acc_guid; // Account ID
                    data["recordtypeid"] = "01237000000TgqkAAC";
                    data["heroku_external_id__c"] = cont_guid;
                    contact_keynames.forEach((field) => {
                      data[field] = contact_parsed_obj[field];
                    });

                    axios({
                      method: "post",
                      url: `${process.env.VUE_APP_APIURL}/${process.env.VUE_APP_APIVER}/contacts/`,
                      data: data,
                      headers: headers,
                    }).then((response) => {
                      data = {};
                      if (!("error" in response)) {
                        const memb_guid = this.guid();
                        data["account__r__heroku_external_id__c"] = acc_guid;
                        data[
                          "membership_contact__r__heroku_external_id__c"
                        ] = cont_guid;
                        data["heroku_external_id__c"] = memb_guid;

                        membership_keynames.forEach((field) => {
                          data[field] = membership_parsed_obj[field];
                        });

                        axios({
                          method: "post",
                          url: `${process.env.VUE_APP_APIURL}/${process.env.VUE_APP_APIVER}/memberships/`,
                          data: data,
                          headers: headers,
                        }).then((response) => {
                          data = {};
                          if (!("error" in response)) {
                            const boat_guid = this.guid();

                            data["heroku_external_id__c"] = boat_guid;
                            data[
                              "account__r__heroku_external_id__c"
                            ] = acc_guid;
                            data[
                              "contact__r__heroku_external_id__c"
                            ] = cont_guid;
                            data[
                              "related_membership__r__heroku_external_id__c"
                            ] = memb_guid;

                            boat_keynames.forEach((field) => {
                              data[field] = boat_parsed_obj[field];
                            });

                            axios({
                              method: "post",
                              url: `${process.env.VUE_APP_APIURL}/${process.env.VUE_APP_APIVER}/boats/`,
                              data: data,
                              headers: headers,
                            }).then((response) => {
                              data = {};
                              if (!("error" in response)) {
                                data["heroku_external_id__c"] = opp_guid;
                                data["name"] = "Pending Invoice Number";
                                data["closedate"] = new Date().toISOString();
                                data["stagename"] = "Invoice Open";
                                data[
                                  "account__heroku_external_id__c"
                                ] = acc_guid;
                                data[
                                  "membership__r__heroku_external_id__c"
                                ] = memb_guid;

                                if (this.campaign_state_value) {
                                  data["campaignsource"] = this.campaign_sfid;
                                }

                                axios({
                                  method: "post",
                                  url: `${process.env.VUE_APP_APIURL}/${process.env.VUE_APP_APIVER}/opportunities/`,
                                  data: data,
                                  headers: headers,
                                }).then((response) => {
                                  if (!("error" in response)) {
                                    console.log("opp insert");
                                    console.log(response);
                                    data = {};

                                    data[
                                      "contact__heroku_external_id__c"
                                    ] = cont_guid;
                                    data[
                                      "opportunity__heroku_external_id__c"
                                    ] = opp_guid;
                                    data["role"] = "Primary Member";
                                    axios({
                                      method: "post",
                                      url: `${process.env.VUE_APP_APIURL}/${process.env.VUE_APP_APIVER}/contactroles/`,
                                      data: data,
                                      headers: headers,
                                    }).then((response) => {
                                      if (!("error" in response)) {
                                        data = {};

                                        var selected_products = [];

                                        var product_ids = {
                                          gold: "01t37000000YWRM",
                                          lake: "01t37000000YWRW",
                                          profmariner: "01t37000000YWRq",
                                          commercial: "01t37000000YWR2",
                                          marine: "01t37000000YWSA",
                                          universal: "01t37000001Ruzn",
                                          donation: "01u37000002MUoz",
                                        };

                                        selected_products.push(
                                          product_ids[
                                            this.CardSelection.toLowerCase()
                                          ]
                                        );
                                        this.TrailerSelection == "None"
                                          ? console.log("No TC selected")
                                          : selected_products.push(
                                              product_ids[
                                                this.TrailerSelection.toLowerCase()
                                              ]
                                            );
                                        data[
                                          "opportunity__heroku_external_id__c"
                                        ] = opp_guid;
                                        data["quantity"] = 1;

                                        if (this.donation_amount > 0) {
                                          selected_products.push(
                                            product_ids["donation"]
                                          );
                                          console.log(
                                            "add product to selected_products"
                                          );
                                        }

                                        selected_products.forEach(
                                          (element, key, arr) => {
                                            if (element == "01t37000000YWRM") {
                                              data["pricebookentryid"] =
                                                "01u37000000wNq8";
                                              data[
                                                "unitprice"
                                              ] = this.card_price;
                                              data["product2id"] = element;
                                              data["listprice"] = 179.0;
                                            } else if (
                                              element == "01t37000000YWRW"
                                            ) {
                                              data["pricebookentryid"] =
                                                "01u37000002MUok";
                                              data[
                                                "unitprice"
                                              ] = this.card_price;
                                              data["product2id"] = element;
                                              data["listprice"] = 119.0;
                                            } else if (
                                              element == "01t37000000YWRq"
                                            ) {
                                              data["pricebookentryid"] =
                                                "01u37000002PAWz";
                                              data[
                                                "unitprice"
                                              ] = this.card_price;
                                              data["product2id"] = element;
                                              data["listprice"] = 365.0;
                                            } else if (
                                              element == "01t37000000YWR2"
                                            ) {
                                              data["pricebookentryid"] =
                                                "01u37000000wNqI";
                                              data[
                                                "unitprice"
                                              ] = this.card_price;
                                              data["product2id"] = element;
                                              data["listprice"] = 179.0;
                                            } else if (
                                              element == "01t37000000YWSA"
                                            ) {
                                              data["pricebookentryid"] =
                                                "01u37000002MUou";
                                              data[
                                                "unitprice"
                                              ] = this.trailering_price;
                                              data["product2id"] = element;
                                              data["listprice"] = 14.0;
                                            } else if (
                                              element == "01t37000001Ruzn"
                                            ) {
                                              data["pricebookentryid"] =
                                                "01u37000002MsSI";
                                              data[
                                                "unitprice"
                                              ] = this.trailering_price;
                                              data["product2id"] = element;
                                              data["listprice"] = 29.95;
                                            } else if (
                                              element == "01u37000002MUoz"
                                            ) {
                                              data["pricebookentryid"] =
                                                "01u37000002MUoz";
                                              data[
                                                "unitprice"
                                              ] = this.donation_amount;
                                              data["product2id"] =
                                                "01t37000001Rnxp";
                                              data["listprice"] = 0;
                                            } else {
                                              console.log("product not found");
                                            }

                                            console.log(data);

                                            //only apply promotion code on gold/lake/prof/comm

                                            console.log(element);
                                            if (
                                              this.promotion_valid &&
                                              (element == "01t37000000YWRM" ||
                                                element == "01t37000000YWRW" ||
                                                element == "01t37000000YWRq" ||
                                                element == "01t37000000YWR2")
                                            ) {
                                              if (this.promotion_sfid != null) {
                                                if (
                                                  data["pricebookentryid"] ==
                                                    "01u37000000wNq8" ||
                                                  data["pricebookentryid"] ==
                                                    "01u37000002MUok" ||
                                                  data["pricebookentryid"] ==
                                                    "01u37000002PAWz" ||
                                                  data["pricebookentryid"] ==
                                                    "01u37000000wNqI"
                                                ) {
                                                  data[
                                                    "promotion_code__c"
                                                  ] = this.promotion_sfid;
                                                }
                                              }
                                            } else {
                                              delete data["promotion_code__c"];
                                              console.log(
                                                "promotion code only applied on card type"
                                              );
                                            }

                                            if (
                                              Object.is(arr.length - 1, key)
                                            ) {
                                              console.log(
                                                `Last callback call at index ${key} with value ${element}`
                                              );
                                              data["final_product__c"] = true;
                                            } else {
                                              data["final_product__c"] = false;
                                            }

                                            axios({
                                              method: "post",
                                              url: `${process.env.VUE_APP_APIURL}/${process.env.VUE_APP_APIVER}/opportunitylineitems/`,
                                              data: data,
                                              headers: headers,
                                            }).then((response) => {
                                              console.log(response)
                                              if (
                                                Object.is(arr.length - 1, key)
                                              ) {
                                                
                                                let charge_authed_card = {};

                                                charge_authed_card["refTransId"] = this.refTransId;
                                                charge_authed_card["amount"] = (
                                                  Math.round(
                                                    this.price_total * 100
                                                  ) / 100
                                                ).toFixed(2);

                                                console.log(charge_authed_card);

                                                axios({
                                                  method: "post",
                                                  url: `${process.env.VUE_APP_APIURL}/${process.env.VUE_APP_APIVER}/authorizenet/chargeauthedcard/`,
                                                  data: charge_authed_card,
                                                  headers: headers,
                                                }).then((response) => {
                                                  data = {};
                                                  console.log("response: ");
                                                  console.log(response);

                                                  var dateObj = new Date();
                                                  var month =
                                                    dateObj.getUTCMonth() + 1; //months from 1-12
                                                  var day = dateObj.getUTCDate();
                                                  var year = dateObj.getUTCFullYear();

                                                  var newdate =
                                                    month +
                                                    "/" +
                                                    day +
                                                    "/" +
                                                    year;

                                                  data[
                                                    "pymt__processor_connection__c"
                                                  ] = "a0P37000009suBVEAY";
                                                  data["pymt__log__c"] =
                                                    "asdasdas";
                                                  data[
                                                    "pymt__payment_processor__c"
                                                  ] = "Authorize.net";
                                                  data["pymt__card_type__c"] =
                                                    "Invoice Open";
                                                  data[
                                                    "pymt__transaction_id__c"
                                                  ] = this.transId;
                                                  data[
                                                    "pymt__authorization_id__c"
                                                  ] = this.auth_code;
                                                  data[
                                                    "pymt__account__r__heroku_external_id__c"
                                                  ] = acc_guid;
                                                  data[
                                                    "pymt__contact__r__heroku_external_id__c"
                                                  ] = cont_guid;
                                                  data[
                                                    "pymt__opportunity__r__heroku_external_id__c"
                                                  ] = opp_guid;
                                                  data["pymt__status__c"] =
                                                    "Completed";
                                                  data[
                                                    "pymt__amount__c"
                                                  ] = this.price_total;
                                                  data[
                                                    "pymt__date__c"
                                                  ] = newdate;
                                                  data[
                                                    "herokudirect__c"
                                                  ] = true;
                                                  data["name"] =
                                                    "Payment via Membership App";

                                                  //insert payment directly to sf
                                                  axios({
                                                    method: "post",
                                                    url: `${process.env.VUE_APP_APIURL}/${process.env.VUE_APP_APIVER}/payments/`,
                                                    data: data,
                                                    headers: headers,
                                                  }).then((response) => {
                                                    console.log(
                                                      "payments insertion result"
                                                    );
                                                    console.log(response);
                                                    this.$bvToast.toast(
                                                      "The member was inserted succesfully. The form has been reset.",
                                                      {
                                                        title:
                                                          "Member inserted successfully.",
                                                        autoHideDelay: 3000,
                                                      }
                                                    );
                                                  });
                                                });
                                              }
                                              //this.clearForm();
                                              //this.$v.$reset();
                                            });
                                          }
                                        );
                                      }
                                    });
                                  }
                                });
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                
                });
              }
              }
            });
            
        }
      } else {
        this.$bvToast.toast(
          "Something isn't right with the form. Please validate each field.",
          {
            title: "Validation error.",
            autoHideDelay: 5000,
          }
        );
      }
    },
    GetCardDesc(cardName) {
      var co = this.CardOptions;
      var i = 0;
      for (i = 0; i < co.length; i++) {
        if (cardName == co[i].value) {
          this.card_desc = co[i].title;
        }
      }
    },
    UpdateCardDesc(event) {
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
      var cardPrice = this.card_price;
      var cartValue = 0;
      //this.card_price + this.trailering_price + this.donation_amount;
      if (this.promotion_type__c == "Dollar_Value_Promotion") {
        //good
        cartValue += cardPrice - this.promotion_value_in_dollars;
      } else if (this.promotion_type__c == "Percentage Value Promotion") {
        //good
        cartValue +=
          cardPrice -
          cardPrice * (this.promotion_value_percentage_discount / 100);
        // } else if (this.promotion_type__c == 'Additional Time Promotion') {
        //   return cartValue
      } else if (this.promotion_type__c == "Additional Trial Time") {
        //good
        cartValue += 0;
      } else {
        cartValue += this.card_price;
      }
      return cartValue + this.trailering_price + this.donation_amount;
    },
  },
};
</script>
