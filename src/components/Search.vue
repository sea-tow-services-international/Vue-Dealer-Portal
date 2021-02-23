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
            <b-button type="submit" variant="primary">Submit</b-button>
          </b-col>
        </b-row>
      </b-form>

      <b-table striped hover :items="response_data"></b-table>
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
    };
  },
  methods: {
    async submitForm() {
      let data = {
        membership_number__c: this.membership_number__c,
      };

      console.log(data);

      axios
        .post("http://127.0.0.1:5000/utility/search/", data)
        .then((response) => {
          this.response_data = response["data"];
          console.log(this.response_data);
        });
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