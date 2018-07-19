<template>
  <v-container fluid grid-list-xl py-0>
    <v-layout row wrap align-center>
      <v-flex xs12 class="text-xs-center">
        <v-dialog v-model="systemLoadingDialog" max-width="500px" class="mx-auto">
          <v-card class="text-xs-center">
            <v-card-text>
              <h3>{{ $lang.strings.system_running}}......</h3>
              <br>
              <v-progress-circular indeterminate :size="70" :width="7" color="blue"></v-progress-circular>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-flex>
    </v-layout>
    <h3> {{$lang.user_profile_update.user_profile_update}} </h3>
    <div class="profile-head app-card">
      <div class="profile-top">
        <img src="/static/img/profile-banner.jpg" alt="profile banner" width="1920" height="165" />
      </div>
      <div class="profile-bottom border-bottom-light-1">
        <div class="user-image text-xs-center mb-3">
          <img :src="userPhotoSticker" class="img-responsive rounded" alt="user images"/>
        </div>
        <div class="user-list-content">
          <div class="text-xs-center">
            <!-- <v-btn
              class="gradient-warning"
              :loading="loading"
              @click.native="loader = 'loading'"
              :disabled="loading"
              @click="onFilePickedBtn(0)">
              {{ $lang.user_profile_update.update_user_photo }}
              <v-icon right dark>cloud_upload</v-icon>
            </v-btn>
            <input 
              type="file" 
              accept="image/*" 
              @change="onFilePicked" 
              style="display: none;" 
              ref="fileInput_0"
              name="fileInput_0"> -->
            <h2 class="fw-bold">{{$lang.user_profile_update.greeting}} {{ user.name }} !</h2>
            <hr>
            <v-stepper v-model="stepperForm">
              <v-stepper-header>
                <v-stepper-step step="1" :complete="stepperForm > 1">{{$lang.user_profile_update.email_verification}}</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step step="2">{{$lang.user_profile_update.email_verification}}</v-stepper-step>
              </v-stepper-header>
              <v-stepper-items>
                <v-stepper-content step="1">
                  <v-card color="amber lighten-5" class="mb-5" height="250px">
                    <h3 class="pt-4 pb-4 title">{{$lang.user_profile_update.email}} : {{ user.email }}</h3>
                    <h3 class="pt-4 pb-4 title">{{$lang.user_profile_update.email_verified}} : {{ user.emailVerified }}</h3>
                    <v-btn class="gradient-primary" :disabled="verifyEmailBtn === false" @click="verifyEmail()">
                      {{$lang.user_profile_update.send_verification_email}}
                    </v-btn>
                  </v-card>
                </v-stepper-content>
                <v-stepper-content step="2">
                  <v-flex xs10 offset-xs1 sm8 offset-sm2>
                    <v-form v-model="userInfoForm.valid" ref="form">
                      <h3>{{$lang.user_profile_update.user_info}}</h3>
                      <v-layout row wrap>
                        <v-flex xs12 sm6>
                          <v-text-field
                            :label="$lang.user_profile_update.name"
                            v-model="userInfoForm.realName"
                            :rules="userInfoForm.realNameRules"
                            :counter="16"
                            required></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm6>
                          <v-radio-group v-model="userInfoForm.gender" row>
                            <v-radio :label="$lang.user_profile_update.male" value="Male" selected></v-radio>
                            <v-radio :label="$lang.user_profile_update.female" value="Female"></v-radio>
                          </v-radio-group>
                        </v-flex>
                        <v-flex xs12 sm6>
                          <!--DatePicker pick birthday-->    
                          <v-menu
                            ref="menu"
                            lazy
                            :close-on-content-click="false"
                            v-model="menu"
                            transition="scale-transition"
                            offset-y
                            full-width
                            :nudge-right="40"
                            min-width="290px"
                            :return-value.sync="userInfoForm.birthDate">
                            <v-text-field
                              slot="activator"
                              :label="$lang.user_profile_update.birthday"
                              v-model="userInfoForm.birthDate"
                              prepend-icon=""
                              readonly
                            ></v-text-field>
                            <v-date-picker v-model="userInfoForm.birthDate" no-title scrollable >
                              <v-spacer></v-spacer>
                              <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                              <v-btn flat color="primary" @click="$refs.menu.save(userInfoForm.birthDate)">OK</v-btn>
                            </v-date-picker>
                          </v-menu>
                        <!--birth date ends-->
                        </v-flex>
                        <v-flex xs12 sm6>
                          <v-text-field
                            :label="$lang.user_profile_update.address"
                            v-model="userInfoForm.address"
                            :rules="userInfoForm.addressRules"
                            required></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm2>
                          <v-select
                            :label="$lang.user_profile_update.country_name"
                            v-bind:items="countryCodeList"  
                            v-model="countryName"
                            @change="bindCountryCode()"
                            ref="countryName"
                            item-text="name"
                            item-value="name"
                            required
                            bottom ></v-select>
                        </v-flex>
                        <v-flex xs12 sm2>
                          <v-select
                            :label="$lang.user_profile_update.country_code"
                            v-bind:items="countryCodeList"  
                            v-model="countryCode"
                            @change="bindCountryName()"
                            ref="countryCode"
                            item-text="code"
                            item-value="code"
                            required
                            bottom ></v-select>
                        </v-flex>
                        <v-flex xs12 sm6>
                          <v-text-field
                            :label="$lang.user_profile_update.phone"
                            v-model="userInfoForm.phoneNumber"
                            :rules="userInfoForm.phoneNumberRules"
                            :counter='10'
                            required></v-text-field>
                        </v-flex>
                      </v-layout>
                      <hr>
                      <!-- users license and account -->
                      <!-- wait for verification -->
                      <v-layout row wrap>
                        <v-flex xs12 sm12>
                          <h3>{{$lang.user_profile_update.user_license}}</h3>
                        </v-flex>
                        <v-flex xs12 sm4>
                          <v-text-field
                            :label="$lang.user_profile_update.license"
                            v-model="userInfoForm.licenseNumber"
                            :rules="userInfoForm.licenseNumberRules"
                            required></v-text-field>
                          <v-select 
                            :label="$lang.user_profile_update.licnese_type"  
                            v-bind:items="licenseTypes"  
                            v-model="licenseType"
                            :rules="[v => !!v || 'License Type is required']"
                            single-line  
                            bottom ></v-select>
                        </v-flex>
                        <!-- license images -->
                        <v-flex xs6 sm4>
                          <h3>{{ $lang.user_profile_update.front }}</h3>
                          <v-btn
                            class="gradient-warning"
                            :loading="loading"
                            @click.native="loader = 'loading'"
                            :disabled="loading"
                            @click="onFilePickedBtn(1)">
                            {{$lang.user_profile_update.upload_license_img}}
                            <v-icon right dark>cloud_upload</v-icon>
                          </v-btn>
                          <input 
                            type="file" 
                            accept="image/*" 
                            @change="onFilePicked" 
                            style="display: none;" 
                            ref="fileInput_1"
                            name="fileInput_1">
                        </v-flex>
                        <v-flex xs6 sm4>
                          <img :src="userInfoForm.licenseImageUrl_1" alt="License Image" class="img-responsive" />
                          <!-- {{userInfoForm.licenseImageUrl_1}} -->
                        </v-flex>
                        <v-flex xs6 sm4 offset-sm4>
                          <h3>{{ $lang.user_profile_update.rear }}</h3>
                          <v-btn
                            class="gradient-warning"
                            :loading="loading"
                            @click.native="loader = 'loading'"
                            :disabled="loading"
                            @click="onFilePickedBtn(2)">
                            {{$lang.user_profile_update.upload_license_img}}
                            <v-icon right dark>cloud_upload</v-icon>
                          </v-btn>
                          <input 
                            type="file" 
                            accept="image/*" 
                            @change="onFilePicked" 
                            style="display: none;" 
                            ref="fileInput_2"
                            name="fileInput_2">
                        </v-flex>
                        <v-flex xs6 sm4>
                          <img :src="userInfoForm.licenseImageUrl_2" alt="License Image" class="img-responsive" />
                        </v-flex>
                        <v-flex xs6 sm4 offset-sm4>
                          <h3>{{ $lang.user_profile_update.with_face }}</h3>
                          <v-btn
                            class="gradient-warning"
                            :loading="loading"
                            @click.native="loader = 'loading'"
                            :disabled="loading"
                            @click="onFilePickedBtn(3)">
                            {{$lang.user_profile_update.upload_license_img}}
                            <v-icon right dark>cloud_upload</v-icon>
                          </v-btn>
                          <input
                            type="file" 
                            accept="image/*" 
                            @change="onFilePicked" 
                            style="display: none;" 
                            ref="fileInput_3"
                            name="fileInput_3">
                        </v-flex>
                        <v-flex xs6 sm4>
                          <img :src="userInfoForm.licenseImageUrl_3" alt="License Image" class="img-responsive" />
                        </v-flex>
                      </v-layout>
                      <hr>
                      <!--
                      <v-layout row wrap>
                        <v-flex xs12 sm12>
                          <h3>{{$lang.user_profile_update.receving_bank}}</h3>
                        </v-flex>
                        <v-flex xs12 sm4>
                          <v-select
                            :label="$lang.user_profile_update.bank_code"
                            v-bind:items="bankCodeList"  
                            v-model="userInfoForm.bankCode"
                            @change="bindBankCode()"
                            ref="bankCode"
                            :rules="[v => !!v || 'Bank Code is required']"
                            item-text="code"
                            item-value="code"
                            required
                            bottom ></v-select>
                        </v-flex>
                        <v-flex xs12 sm8>
                          <v-text-field
                            :label="$lang.user_profile_update.bank_account"
                            v-model="userInfoForm.bankAccount"
                            :rules="userInfoForm.bankAccountRules"
                            :counter="16"
                            type="number"
                            required></v-text-field>
                        </v-flex>
                        <v-flex xs6 sm4>
                          <v-select
                            :label="$lang.user_profile_update.bank"
                            v-bind:items="bankCodeList"  
                            v-model="userInfoForm.bankName"
                            @change="bindBankName()"
                            ref="bankName"
                            :rules="[v => !!v || 'Bank Name is required']"
                            item-text="name"
                            item-value="name"
                            required
                            bottom ></v-select>
                        </v-flex>
                        <v-flex xs6 sm4>
                          <h3>{{ $lang.user_profile_update.passbook_photo }}</h3>
                          <v-btn
                            class="gradient-warning"
                            :loading="loading"
                            @click.native="loader = 'loading'"
                            :disabled="loading"
                            @click="onFilePickedBtn(4)">
                            {{$lang.user_profile_update.upload_passbook}}
                            <v-icon right dark>cloud_upload</v-icon>
                          </v-btn>
                          <input 
                            type="file" 
                            accept="image/*" 
                            @change="onFilePicked" 
                            style="display: none;" 
                            ref="fileInput_4"
                            name="fileInput_4">
                        </v-flex>
                        <v-flex xs6 sm4>
                          <img :src="userInfoForm.licenseImageUrl_4" alt="License Image" class="img-responsive" />
                        </v-flex>
                      </v-layout>
                      <hr>
                      -->
                      <v-layout pb-4 row wrap>
                        <v-flex sm4 offset-sm2>
                          <v-btn
                            block
                            class="warning"
                            to="/users/user-profile">
                            {{$lang.user_profile_update.back}}
                          </v-btn>
                        </v-flex>
                        <v-flex sm4>
                          <v-btn block @click="updateUserInfo" class="gradient-success">
                            {{$lang.strings.confirm}}
                          </v-btn>
                        </v-flex>
                      </v-layout>
                    </v-form>
                  </v-flex>
                </v-stepper-content>
              </v-stepper-items>
            </v-stepper>
          </div>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script>
/* eslint-disable */
import firebase,{ database } from "firebase"
import swal from "sweetalert2"
import { mapGetters } from 'vuex'
import { countryCodeList } from './CountryCodeList'

export default {
  data() {
    return {
      systemLoadingDialog: false,
      user: "",
      userInfoFormStatus: 'Create',
      userInfoForm: { // userInfoForm elements would be used while update user info
        valid: false,
        formType: '', // if it's the first time, set to create, otherwose set to update
        realName: "",
        realNameRules: [
          v => !!v || "Real Name is required",
          v => v.length <= 16 || "Real Name must be less than 16 characters"
        ],
        gender: "Male",
        birthDate: "1980-01-01",
        birthDatelRules: [
          v => !!v || "Birth Date is required"
        ],
        address: '',
        addressRules: [
          v => !!v || "Address is required"
        ],
        phoneNumber: '',
        phoneNumberRules: [
          v => !!v || "Phone Number is required",
          v => v.length <= 10 || "Phone Number must be no more than 10 characters"
        ],
        accountReceivable: '',
        accountReceivableRules: [
          v => !!v || "Account Receivable is required"
        ],
        licenseNumber: '',
        licenseNumberRules: [
          v => !!v || "License Number is required"
        ],
        introducerCode: '',
        licenseImage_1: '',
        licenseImageUrl_1: '/static/img/license.png',
        licenseImage_2: '',
        licenseImageUrl_2: '/static/img/license.png',
        licenseImage_3: '',
        licenseImageUrl_3: '/static/img/selfie.jpg',
        uid: firebase.auth().currentUser.uid
      },
      menu: '',
      countryCodeList: countryCodeList,
      countryName: '',
      countryCode: '',
      loading: false,
      licenseTypes: [
        {text: this.$lang.user_profile_update.tw_license, value: 'TW License'},
        {text: this.$lang.user_profile_update.tw_resident_permit, value: 'TW Resident Permit'},
        {text: this.$lang.user_profile_update.passport, value: 'Passport'}
      ],
      licenseType: '',
      stepperForm: 0,
      verifyEmailBtn: true,
      // photo sticler
      userPhotoSticker: '/static/img/user.png'
    };
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    async getUserInfo () {
      this.systemLoadingDialog = true
      var db = firebase.firestore()
      try {
        console.log(firebase.auth().currentUser.uid)
        var query = await db.collection('users').where('userUid', '==', firebase.auth().currentUser.uid).get()
        this.user = query.docs[0].data()
        
        this.user.emailVerified = firebase.auth().currentUser.emailVerified
        this.user.docId = query.docs[0].id
        this.countryCode = countryCodeList[0].code
        this.countryName = countryCodeList[0].name

        if (this.user.emailVerified) {
          this.stepperForm = 2
        }
        if (this.user.informationFilled) {
          this.userInfoFormStatus = 'Update'
          this.userInfoForm.realName = this.user.realName
          this.userInfoForm.gender = this.user.gender
          this.userInfoForm.birthDate = this.user.birthDate
          this.userInfoForm.address = this.user.address
          this.userInfoForm.phoneNumber = this.user.phoneNumber
          this.userInfoForm.licenseNumber = this.user.licenseNumber
          this.licenseType = this.user.licenseType
          this.userInfoForm.licenseImageUrl_1 = this.user.licenseImage1
          this.userInfoForm.licenseImageUrl_2 = this.user.licenseImage2
          this.userInfoForm.licenseImageUrl_3 = this.user.licenseImage3
          //
          this.countryName = this.user.countryName
          this.countryCode = this.user.countryCode
        }
        // this.$store.dispatch('setUser', response.data)
        // console.log(this.user)
        this.$store.dispatch('setUser', this.user)
        this.systemLoadingDialog = false
      } catch (error) {
        this.systemLoadingDialog = false
        console.log(error)
      }
    },
    async updateUserInfo () {
      console.log(this.userInfoFormStatus)
      var file1 = this.userInfoForm.licenseImage_1
      var file2 = this.userInfoForm.licenseImage_2
      var file3 = this.userInfoForm.licenseImage_3
      // validate the form
      if (!this.$refs.form.validate()) {
        console.log("form submit error")
        swal(
          'Oops !',
          this.$lang.alert.error.plz_check_form_again,
          'info'
        )
        return
      }
      // check if the license picture field is set
      if (this.userInfoFormStatus === 'Create'){
        if (!file1 || !file2 || !file3){
          swal(
            'Oops !',
            this.$lang.alert.error.please_upload_valid_image,
            'info'
          )
          return
        }
      }
      // start updating
      try {
        var db = firebase.firestore()
        // var storage = firebase.storage();
        var storageRef = firebase.storage().ref();
        // define user reference
        var userRef = db.collection('users').doc(this.user.docId)
        
        this.systemLoadingDialog = true
        if (this.userInfoFormStatus === 'Create') {
          await userRef.update({
            realName: this.userInfoForm.realName,
            gender: this.userInfoForm.gender,
            birthDate: this.userInfoForm.birthDate,
            licenseNumber: this.userInfoForm.licenseNumber,
            licenseType: this.licenseType,
            address: this.userInfoForm.address,
            phoneNumber: this.userInfoForm.phoneNumber,
            informationFilled: true,
            //
            countryName: this.countryName,
            countryCode: this.countryCode
          })

          // var file1 = this.userInfoForm.licenseImage_1
          var metadata1 = {
            contentType: file1.type
          };
          var uploadTask1 = storageRef.child('images/' + file1.name).put(file1, metadata1);
          uploadTask1.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
            function(snapshot) {
              // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
              var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + progress + '% done');
              switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                  console.log('Upload is paused');
                  break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                  console.log('Upload is running');
                  break;
              }
            }, function(error) {
              console.log(error) 
            }, async function() {
              // Upload completed successfully, now we can get the download URL
              var downloadURL = await uploadTask1.snapshot.ref.getDownloadURL()
              await userRef.update({
                licenseImage1: downloadURL
            })
          })

          // var file2 = this.userInfoForm.licenseImage_2
          var metadata2 = {
            contentType: file2.type
          };
          var uploadTask2 = storageRef.child('images/' + file2.name).put(file2, metadata2);
          uploadTask2.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
            function(snapshot) {
              // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
              var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + progress + '% done');
              switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                  console.log('Upload is paused');
                  break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                  console.log('Upload is running');
                  break;
              }
            }, function(error) {
              console.log(error) 
            }, async function() {
              // Upload completed successfully, now we can get the download URL
              var downloadURL = await uploadTask2.snapshot.ref.getDownloadURL()
              await userRef.update({
                licenseImage2: downloadURL
            })
          })

          // var file3 = this.userInfoForm.licenseImage_3
          var metadata3 = {
            contentType: file3.type
          };
          var uploadTask3 = storageRef.child('images/' + file3.name).put(file3, metadata3);
          uploadTask3.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
            function(snapshot) {
              // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
              var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + progress + '% done');
              switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                  console.log('Upload is paused');
                  break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                  console.log('Upload is running');
                  break;
              }
            }, function(error) {
              console.log(error) 
            }, async function() {
              // Upload completed successfully, now we can get the download URL
              var downloadURL = await uploadTask3.snapshot.ref.getDownloadURL()
              await userRef.update({
                licenseImage3: downloadURL
            })
          })
          swal(
            'Good !',
            '',
            'success'
          )
          this.getUserInfo()
          this.systemLoadingDialog = false
        } else if (this.userInfoFormStatus === 'Update') {
          await userRef.update({
            realName: this.userInfoForm.realName,
            gender: this.userInfoForm.gender,
            birthDate: this.userInfoForm.birthDate,
            licenseNumber: this.userInfoForm.licenseNumber,
            licenseType: this.licenseType,
            address: this.userInfoForm.address,
            phoneNumber: this.userInfoForm.phoneNumber,
            informationFilled: true,
            //
            countryName: this.countryName,
            countryCode: this.countryCode
          })

          if (file1) {
            var metadata4 = {
              contentType: file1.type
            };
            var uploadTask4 = storageRef.child('images/' + file1.name).put(file1, metadata4);
            uploadTask4.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
              function(snapshot) {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                  case firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused');
                    break;
                  case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                    break;
                }
              }, function(error) {
                console.log(error) 
              }, async function() {
                // Upload completed successfully, now we can get the download URL
                var downloadURL = await uploadTask4.snapshot.ref.getDownloadURL()
                await userRef.update({
                  licenseImage1: downloadURL
              })
            })
          }
          if (file2) {
            var metadata5 = {
              contentType: file2.type
            };
            var uploadTask5 = storageRef.child('images/' + file2.name).put(file2, metadata5);
            uploadTask5.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
              function(snapshot) {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                  case firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused');
                    break;
                  case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                    break;
                }
              }, function(error) {
                console.log(error) 
              }, async function() {
                // Upload completed successfully, now we can get the download URL
                var downloadURL = await uploadTask5.snapshot.ref.getDownloadURL()
                await userRef.update({
                  licenseImage2: downloadURL
              })
            })
          }
          if (file3) {
            var metadata6 = {
              contentType: file3.type
            };
            var uploadTask6 = storageRef.child('images/' + file3.name).put(file3, metadata6);
            uploadTask6.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
              function(snapshot) {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                  case firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused');
                    break;
                  case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                    break;
                }
              }, function(error) {
                console.log(error) 
              }, async function() {
                // Upload completed successfully, now we can get the download URL
                var downloadURL = await uploadTask6.snapshot.ref.getDownloadURL()
                await userRef.update({
                  licenseImage3: downloadURL
              })
            })
          }
          swal(
            'Good !',
            '',
            'success'
          )
          this.getUserInfo()
          this.systemLoadingDialog = false
        }
        
      } catch (error) {
        this.systemLoadingDialog = false
        console.log(error)
      }
    },
    onFilePicked (event) {
      // see which button has been activated
      const btn = event.target.name
      // console.log(btn)
      const files = event.target.files
      let filename = files[0].name
      // if the file doesnt have extension
      if (filename.lastIndexOf('.') <= 0) {
        alert('Please add a valid file!')
      }
      // turn this binary file to string value, for later uploads
      const fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        // for image preview
        switch (btn) {
          case 'fileInput_1':
            this.userInfoForm.licenseImageUrl_1 = fileReader.result
            // this.userInfoForm.licenseImage_1_modified = true
            break;
          case 'fileInput_2':
            this.userInfoForm.licenseImageUrl_2 = fileReader.result
            // this.userInfoForm.licenseImage_2_modified = true
            break;
          case 'fileInput_3':
            this.userInfoForm.licenseImageUrl_3 = fileReader.result
            // this.userInfoForm.licenseImage_3_modified = true
            break;
          case 'fileInput_4':
            this.userInfoForm.licenseImageUrl_4 = fileReader.result
            // this.userInfoForm.licenseImage_4_modified = true
            break;
          default: 
            break;  
        }
      })
      switch (btn) {
          case 'fileInput_0':
            // store the raw file
            fileReader.readAsDataURL(files[0])
            this.userPhotoSticker = files[0]
            this.updateUserPhoto()
            break;
          case 'fileInput_1':
            // store the raw file
            fileReader.readAsDataURL(files[0])
            this.userInfoForm.licenseImage_1 = files[0]
            // console.log(this.userInfoForm.licenseImage_1)
            this.userInfoForm.licenseImageName_1 = files[0].name
            this.userInfoForm.licenseImageType_1 = files[0].type
            break;
          case 'fileInput_2':
            // store the raw file
            fileReader.readAsDataURL(files[0])
            this.userInfoForm.licenseImage_2 = files[0]
            this.userInfoForm.licenseImageName_2 = files[0].name
            this.userInfoForm.licenseImageType_2 = files[0].type
            break;
          case 'fileInput_3':
            // store the raw file
            fileReader.readAsDataURL(files[0])
            this.userInfoForm.licenseImage_3 = files[0]
            this.userInfoForm.licenseImageName_3 = files[0].name
            this.userInfoForm.licenseImageType_3 = files[0].type
            break;
          case 'fileInput_4':
            // store the raw file
            fileReader.readAsDataURL(files[0])
            this.userInfoForm.licenseImage_4 = files[0]
            this.userInfoForm.licenseImageName_4 = files[0].name
            this.userInfoForm.licenseImageType_4 = files[0].type
            break;
          default: 
            break;  
        }
    },
    onFilePickedBtn (number) {
      switch (number) {
        case 0:
          this.$refs.fileInput_0.click()
          break;
        case 1:
          this.$refs.fileInput_1.click()
          break;
        case 2:
          this.$refs.fileInput_2.click()
          break;
        case 3:
          this.$refs.fileInput_3.click()
          break;
        case 4:
          this.$refs.fileInput_4.click()
          break;
        default: 
          break;  
      }
    },
    // firebase function
    verifyEmail () {
      var user = firebase.auth().currentUser
      // if (process.env.NODE_ENV === 'production') {
      //   var actionCodeSettings = {
      //     url: 'http://member.timespacefintech.com/users/user-profile',
      //     handleCodeInApp: false
      //   }
      // } else {
      console.log('localhost')
      var actionCodeSettings = {
        url: 'http://localhost:8080/users/user-profile',
        handleCodeInApp: false
      }
      // }
      user.sendEmailVerification(actionCodeSettings)
        .then(() => {
          swal(
            this.$lang.alert.success.title[0],
            this.$lang.alert.success.description.verf_email,
            'success'
          )
          this.stepperForm = 2
      }).catch(function(error) {
          console.log(error)
      })
    },
    updateUserPhoto () {
      this.systemLoadingDialog = true
      var storageRef = firebase.storage().ref()
      var file = this.userPhotoSticker
      // console.log(file)
      var metadata = {
        contentType: file.type
      }
      // Upload file and metadata to the object 'images/mountains.jpg'
      var uploadTaskPhotoSticker = storageRef.child('images/users/' + firebase.auth().currentUser.uid + '/' + file.name).put(file, metadata)
      // Listen for state changes, errors, and completion of the upload.
      uploadTaskPhotoSticker.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        function (snapshot) {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log('Upload User Photo is ' + progress + '% done')
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              console.log('Upload User Photo is paused')
              break
            case firebase.storage.TaskState.RUNNING: // or 'running'
              console.log('Upload User Photo is running')
              break
          }
        }, (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break

            case 'storage/canceled':
              // User canceled the upload
              break

            case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              break
          }
        }, () => {
          // Upload completed successfully, now we can get the download URL
          uploadTaskPhotoSticker.snapshot.ref.getDownloadURL().then((downloadURL) => {
            UserService.updateUserPhotoSticker({
              userUid: firebase.auth().currentUser.uid,
              userPhotoSticker: downloadURL
            }).then(response => {
              console.log('user photo sticker done')
            }).catch(error => {
              console.log(error)
            })
            this.systemLoadingDialog = false
            this.getUserInfo()
          })
        })
    },
    bindCountryCode () {
      // console.log(this.$refs.bankName.inputValue)
      for (var key in countryCodeList) {
        if (countryCodeList[key].name == this.$refs.countryName.inputValue) {
          this.countryCode = countryCodeList[key].code
          return
        }
      }
    },
    bindCountryName () {
      // console.log(this.$refs.bankName.inputValue)
      for (var key in countryCodeList) {
        if (countryCodeList[key].code == this.$refs.countryCode.inputValue) {
          this.countryName = countryCodeList[key].name
          return
        }
      }
    }
  },
  watch: {
    getLang: function () {
      // console.log('get lang')
      this.licenseTypes = [
        {text: this.$lang.user_profile_update.tw_license, value: 'TW License'},
        {text: this.$lang.user_profile_update.tw_resident_permit, value: 'TW Resident Permit'},
        {text: this.$lang.user_profile_update.passport, value: 'Passport'}
      ]
    }
  },
  computed: {
      ...mapGetters({
          getLang: 'getLang'
      })
  }
};
</script>
<style>
.rounded {
  width: 100px;
  height: 100px;
  position: relative;
  overflow: hidden;
  border-radius: 50%;
}
</style>
