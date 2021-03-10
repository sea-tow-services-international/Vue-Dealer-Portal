<template>
  <div>
      <b-form @submit.prevent="submitForm" id="dealer-form">
        <b-form-group
          label-cols-lg="5"
          label="Search for a membership"
          label-size="lg"
          label-class="font-weight-bold pt-0"
          class="mb-0"
        ></b-form-group>

        <b-row>
          <b-col>
            <b-input-group>
              <template #prepend>
                <b-form-select
                  v-model="search_type"
                  :options="search_options"
                ></b-form-select>
              </template>
              <b-form-input
                id="membership_number__c"
                v-model="$v.membership_number__c.$model"
              ></b-form-input>
            </b-input-group>
          </b-col>
          <b-col>
            <b-button
              @click="toggleBusyAndClear"
              type="submit"
              variant="primary"
              :disabled="
                this.search_type == null ||
                this.membership_number__c == null ||
                this.membership_number__c == ''
              "
              >Submit</b-button
            >
          </b-col>
        </b-row>
      </b-form>

      <!-- <b-table striped hover :busy="isBusy" class="mt-3" :fields="tableFields" :items="response_data" outlined></b-table> -->

      <template>
        <div>
          <b-table
            :fields="tableFields"
            :items="response_data"
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
                @click="ExpandAndShowData(row, row.index)"
                class="mr-2"
              >
                {{ row.detailsShowing ? "Hide" : "Show" }} Details
              </b-button>
            </template>

            <!-- Make editable fields here -->
            <template #row-details="row">
              <b-card>
                <li
                  v-for="item in response_data[row.index]['full_data']['boats']"
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
  </div>
</template>

<script>
import axios from "axios";

import { required, integer } from "vuelidate/lib/validators";

export default {
  data() {
    return {
      search_options: [
        { value: null, text: "Please select an option" },
        { value: "phone", text: "Phone" },
        { value: "email", text: "Email" },
        { value: "member_number", text: "Member Number" },
      ],
      membership_number__c: "42069",
      search_type: null,
      response_data: [],
      full_data: [],
      isBusy: false,
      tableFields: [
        {
          label: "Membership Number",
           key: "membership_number__c",
           sortable: true
        },
        {
          label: "Credit Card Name",
          key: "card_name__c",
          sortable: false
        },
        {
          key: "show_details",
          sortable: false
        }
      ]
    };
  },
  methods: {
    async submitForm() {
      let data = {
        search_term: this.membership_number__c,
        search_type: this.search_type,
      };

      console.log(data);

      axios
        .post(`${process.env.VUE_APP_APIURL}/utility/search/`, data)
        .then((response) => {
          response["data"].forEach(
            (element) => (
              (element["show_details"] = false), console.log(element)
            )
          );
          console.log(response)
          this.response_data = response["data"];
        })
        .then(() => {
          this.toggleBusy();
        });
    },
    toggleBusy() {
      this.isBusy = !this.isBusy;
    },
    ExpandAndShowData(row, index) {
      console.log(index)
      let data = {
        accountid: this.response_data[index]["account__c"],
      };
      
      console.log(this.response_data[index])

      axios
        .post(`${process.env.VUE_APP_APIURL}/utility/getallinfo/`, data)
        .then((response) => {
          this.response_data[index]["full_data"] = response["data"];
        })
        .then(() => {
          row.toggleDetails();
        });
    },
  },
  validations: {
    search_type: {
      required,
    },
    membership_number__c: {
      required,
      integer,
    },
  },
};
</script>