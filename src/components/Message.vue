<script lang="ts">

import  axios from 'axios'

  export default {	
    data() {
      return {
        message: "default message"
      }
    },
    mounted() {
        console.log("mounted");
        axios.get( "http://localhost:5000/api/message")
        .then((response) => {
          console.log(response.data);
          this.message = response.data.text;
        })
        
    }
  }

</script>


<template>
    <h1 class="green">Message Component</h1>
    <p> {{  message }}</p>
</template>