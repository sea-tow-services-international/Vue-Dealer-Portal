<template>
  <div>
    <b-form @submit.prevent="submitForm" id="dealer-form">
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
  </div>
</template>

<script>
import axios from "axios";

import { required, integer } from "vuelidate/lib/validators";

export default {
  data() {
    return {
      membership_number__c: "",
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
  methods: {
    async submitForm() {
      console.log(this.$toasted) 
      console.log('aaa"')
      this.$toasted.show('Searching..')
      let data = {
        search_term: this.membership_number__c,
        search_type: this.search_type,
      };

      axios
        .post(`${process.env.VUE_APP_APIURL}/${process.env.VUE_APP_APIVER}/utility/search/`, data)
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
          .post(`${process.env.VUE_APP_APIURL}/${process.env.VUE_APP_APIVER}/utility/getallinfo/`, data)
          .then((response) => {
            this.response_data[index]["full_data"] = response["data"];
          })
          .then(() => {
              //pass to dealer portal\
              this.detailsShowing = false
           
          });
      } else {
        //clear form+table
        this.detailsShowing = false
           
      }
    },
    ExpandAndShowData(row, index, detailsShowing) {
      if (!detailsShowing) {
        let data = {
          accountid: this.response_data[index]["account__c"],
        };

        console.log(this.response_data[index]);

        axios
          .post(`${process.env.VUE_APP_APIURL}/${process.env.VUE_APP_APIVER}/utility/getallinfo/`, data)
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