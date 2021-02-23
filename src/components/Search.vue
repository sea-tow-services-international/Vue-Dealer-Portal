<template>
  <div>
    <b-container>
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
            <b-form-input
              id="membership_number__c"
              v-model="$v.membership_number__c.$model"
            ></b-form-input>
          </b-col>
          <b-col>
            <b-button
              @click="toggleBusyAndClear"
              type="submit"
              variant="primary"
              >Submit</b-button
            >
          </b-col>
        </b-row>
      </b-form>

      <!-- <b-table striped hover :busy="isBusy" class="mt-3" :fields="tableFields" :items="response_data" outlined></b-table> -->
    
      <template>
        <div>
          <b-table :items="response_data" :fields="tableFields" striped responsive="sm">
            <template #cell(show_details)="row">
              <b-button size="sm" @click="row.toggleDetails" class="mr-2">
                {{ row.detailsShowing ? "Hide" : "Show" }} Details
              </b-button>
            </template>


            <!-- Make editable fields here -->
            <template #row-details="row">
              <b-card>
                <b-row class="mb-2">
                  <b-col sm="3" class="text-sm-right"><b>Age:</b></b-col>
                  <b-col>{{ row.item.age }}</b-col>
                </b-row>

                <b-row class="mb-2">
                  <b-col sm="3" class="text-sm-right"><b>Is Active:</b></b-col>
                  <b-col>{{ row.item.isActive }}</b-col>
                </b-row>

                <b-button size="sm" @click="row.toggleDetails"
                  >Hide Details</b-button
                >
              </b-card>
              <!-- Make editable fields here END -->
            </template>
          </b-table>
        </div>
      </template>
      </b-container>
  </div>
</template>

<script>
import axios from "axios";

import { required, integer } from "vuelidate/lib/validators";

export default {
  data() {
    return {
      membership_number__c: "42069",
      response_data: [],
      isBusy: false,
      tableFields: ['card_name__c', 'show_details'],
    };
  },
  methods: {
    async submitForm() {
      let data = {
        membership_number__c: this.membership_number__c,
      };

      axios
        .post("http://127.0.0.1:5000/utility/search/", data)
        .then((response) => {
            response["data"].forEach(element => element['show_details'] = false)
          this.response_data = response["data"];
          
          console.log(this.response_data[0]);
        })
        .then(() => {
          this.toggleBusy();
        });
    },
    toggleBusyAndClear() {
      this.response_data = [];
      this.toggleBusy();
    },
    toggleBusy() {
      this.isBusy = !this.isBusy;
    },
    ExpandAndShowData(row) {
      console.log(row);
    },
  },
  validations: {
    membership_number__c: {
      required,
      integer,
    },
  },
};
</script>