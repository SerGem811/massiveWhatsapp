<template>
  <div class="form-container">
    <el-tabs v-model="tab" style="min-height:400px;margin-top:30px;">
      <el-tab-pane name="2" label="Auto Resposta">
        <el-form>
          <div class="row">
            <div class="col-md-3">
              <label class="float-left" style="font-weight: bold;">Nome</label>
              <el-input placeholder="Nome" v-model="response.name"></el-input>
            </div>
            <div class="col-md-3">
              <div class="form-group">
                <label class="float-left" style="font-weight: bold;">Gatilho (trigger)</label>
                <el-input placeholder="trigger" v-model="response.message"></el-input>
              </div>
            </div>
            <div class="col-md-3">
              <label class="float-left" style="font-weight: bold;">Resposta</label>
              <el-input
                type="textarea"
                v-model="response.response"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="Please input"
              ></el-input>
            </div>
            <div class="col-md-3">
              <button
                class="float-left btn-danger btn-sm btn"
                style="margin-top:40px;"
                v-if="activeSave"
                @click="set"
                type="danger"
              >Submit</button>
              <button
                class="float-left mt-5 btn-danger btn btn-sm"
                v-if="activeUpdate"
                @click="update"
                type="danger"
              >Update</button>
            </div>
          </div>
          <el-form-item style="float:left;"></el-form-item>
        </el-form>

        <table class="table table-striped">
          <thead class="thead-dark">
            <tr>
              <th style="width: 5%" scope="col">Id</th>
              <th style="width: 10%"></th>
              <th style="width: 10%" scope="col">Name</th>
              <th style="width: 10%" scope="col">Trigger</th>
              <th style="width: 20%" scope="col">Resposta</th>
              <th></th>
            </tr>
          </thead>
          <draggable v-model="responses" tag="tbody" @update="moved">
            <tr v-for="item in responses" :key="item.name">
              <td scope="row">{{ item.id }}</td>
              <td>
                <button
                  class="btn-danger btn btn-sm"
                  @click="edit(item)"
                  type="danger"
                  size="small"
                >
                  <i class="el-icon-edit"></i>
                </button>
                <el-popconfirm
                  @onConfirm="deleteRes(item.id)"
                  confirmButtonText="OK"
                  cancelButtonText="No, Thanks"
                  icon="el-icon-info"
                  iconColor="red"
                  title="Are you sure to delete this?"
                >
                  <el-button
                    slot="reference"
                    class="btn-danger btn btn-sm"
                    type="danger"
                    size="small"
                  >
                    <i class="el-icon-delete"></i>
                  </el-button>
                </el-popconfirm>
              </td>
              <td>{{ item.name }}</td>
              <td>{{ item.message }}</td>
              <td>
                <label class="float-left;">{{ item.response }}</label>
              </td>
              <td></td>
            </tr>
          </draggable>
        </table>
      </el-tab-pane>

      <el-tab-pane name="4" label="BulkData Import">
        <el-upload
          class="upload-demo"
          drag
          :action="endpointUpload"
          multiple
          name="files"
          :on-success="successUpload"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            Upload here your file
            <em>click to load</em>
          </div>
          <div slot="tip" class="el-upload__tip">
            can upload CSV and TXT
            <b>2GB</b>. you can download
            the template from
            <a href="/data.csv">here</a>
          </div>
        </el-upload>
      </el-tab-pane>

      <el-tab-pane name="1" show="false" label="Mercury API Config">
        <div class="row">
          <div class="col-md-3">
            <label class="float-left" style="font-weight: bold">Name</label>
            <el-input v-model="userMercury.name"></el-input>
          </div>
          <div class="col-md-3">
            <label class="float-left" style="font-weight: bold">API</label>
            <el-input v-model="userMercury.apitoken"></el-input>
          </div>
          <div class="col-md-2">
            <button
              class="btn btn-danger btn-sm float-left"
              style="margin-top:35px;"
              @click="updateUser"
              type="danger"
            >Update</button>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane name="5" label="Chat API Config">
        <div class="row">
          <div class="col-md-3">
            <label class="float-left" style="font-weight: bold">Name</label>
            <el-input v-model="userChat.name"></el-input>
          </div>
          <div class="col-md-3">
            <label class="float-left" style="font-weight: bold">API</label>
            <el-input v-model="userChat.apitoken"></el-input>
          </div>
          <div class="col-md-2">
            <button
              class="btn btn-danger btn-sm float-left"
              style="margin-top:35px;"
              @click="updateUserChat"
              type="danger"
            >Update</button>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import {
  getAllResponses,
  countResponses,
  setResponse,
  updateResponse,
  deleteResponse,
  setBulkData,
  getBulkData,
  getUser,
  updateUser,
  // added by gardener
  updateUserChat,
} from "../utils/actions";
import { BASE_URL } from "../utils/endpoints";

export default {
  components: {
    draggable
  },
  data() {
    return {
      apiToken: "",
      endpointUpload: BASE_URL + "/upload",
      bulkData: [],
      name: "",
      response: {
        id: "",
        name: "",
        response: "",
        message: ""
      },
      userMercury: {
        name: "",
        apitoken: ""
      },
      userChat: {
        name: "",
        apitoken: ""
      },
      responses: [],
      pagination: {
        count: 2,
        pageSize: 100,
        currentPage: 1
      },
      activeUpdate: false,
      activeSave: true,
      tab: "2"
    };
  },
  methods: {
    moved(data) {
      //data.moved.element.order = data.moved.newIndex
      this.updateOrders();
      //data.element.order = data.newIndex
    },
    async updateOrders() {
      this.responses.forEach(async (register, item) => {
        register.order = item;
        await updateResponse(register.id, register);
      });
    },
    changeOrder(position, row) {
      console.log((row.$index = 1));
      // si es el primer registro no puede subir hacia arriba
      // si es el ultimo no se puede ir hacia abajo

      if (position == "up") {
        //responses[] = 0
        row.order = row.order - 1;
      }

      if (position == "down") {
        row.order = row.order + 1;
      }
    },
    parseCSV(str) {
      var arr = [];
      var quote = false; // true means we're inside a quoted field

      // iterate over each character, keep track of current row and column (of the returned array)
      for (var row = 0, col = 0, c = 0; c < str.length; c++) {
        var cc = str[c],
          nc = str[c + 1]; // current character, next character
        arr[row] = arr[row] || []; // create a new row if necessary
        arr[row][col] = arr[row][col] || ""; // create a new column (start with empty string) if necessary

        // If the current character is a quotation mark, and we're inside a
        // quoted field, and the next character is also a quotation mark,
        // add a quotation mark to the current column and skip the next character
        if (cc == '"' && quote && nc == '"') {
          arr[row][col] += cc;
          ++c;
          continue;
        }

        // If it's just one quotation mark, begin/end quoted field
        if (cc == '"') {
          quote = !quote;
          continue;
        }

        // If it's a comma and we're not in a quoted field, move on to the next column
        if (cc == "," && !quote) {
          ++col;
          continue;
        }

        // If it's a newline (CRLF) and we're not in a quoted field, skip the next character
        // and move on to the next row and move to column 0 of that new row
        if (cc == "\r" && nc == "\n" && !quote) {
          ++row;
          col = 0;
          ++c;
          continue;
        }

        // If it's a newline (LF or CR) and we're not in a quoted field,
        // move on to the next row and move to column 0 of that new row
        if (cc == "\n" && !quote) {
          ++row;
          col = 0;
          continue;
        }
        if (cc == "\r" && !quote) {
          ++row;
          col = 0;
          continue;
        }

        // Otherwise, append the current character to the current column
        arr[row][col] += cc;
      }
      return arr;
    },
    async successUpload(event) {
      let response = event[0];
      try {
        await setBulkData({
          url: response.url,
          start: new Date(),
          processed: false,
          whatsappMode: true
        });
        this.getAllBulkData();
        this.tab = "3";
        this.$notify({
          title: "Success",
          message: "CSV was saved.",
          type: "success"
        });
        this.refresh();
      } catch (err) {
        this.$notify.error({
          title: "error",
          message: err.message
        });
      }
    },
    edit(data) {
      this.response = data;

      this.activeUpdate = true;
      this.activeSave = false;
    },
    deleteRes(id) {
      console.log("je", id);
      deleteResponse(id)
        .then(response => {
          this.$notify({
            title: "Success",
            message: "Response was deleted.",
            type: "success"
          });
          this.refresh();
        })
        .catch(error => {
          this.$notify.error({
            title: "error",
            message: error.message
          });
        });
    },
    getAllBulkData() {
      getBulkData()
        .then(response => {
          this.bulkData = response.data;
        })
        .catch(error => {
          this.$notify.error({
            title: "error",
            message: error.message
          });
        });
    },
    refresh() {
      this.getAll();
      this.count();
    },
    getAll() {
      getAllResponses(this.pagination)
        .then(response => {
          let resData = response.data;
          this.responses = resData;
        })
        .catch(error => {
          this.$notify.error({
            title: "error",
            message: error.message
          });
        });
    },
    count() {
      countResponses()
        .then(response => {
          let resData = response.data;
          this.pagination.count = Math.ceil(resData / this.pagination.pageSize);
        })
        .catch(error => {});
    },
    set() {
      setResponse(this.response)
        .then(response => {
          this.$notify({
            title: "Success",
            message: "Response was Saved.",
            type: "success"
          });
          this.refresh();
        })
        .catch(error => {
          this.$notify.error({
            title: "error",
            message: error.message
          });
        });
    },
    update() {
      updateResponse(this.response.id, this.response)
        .then(response => {
          this.refresh();
          this.$notify({
            title: "Success",
            message: "Response was updated.",
            type: "success"
          });
          this.response = {
            id: "",
            name: "",
            response: "",
            message: ""
          };

          this.activeUpdate = false;
          this.activeSave = true;
        })
        .catch(error => {
          this.$notify.error({
            title: "error",
            message: error.message
          });
        });
    },
    prev(e) {
      this.pagination.currentPage = e;
      this.refresh();
    },
    next(e) {
      this.pagination.currentPage = e;
      this.refresh();
    },

    currentChange(e) {
      this.pagination.currentPage = e;
      this.refresh();
    },

    //users
    getUser() {
      getUser()
        .then(response => {
          this.userMercury = response.data;
        })
        .catch(error => {
          this.$notify.error({
            title: "error",
            message: error.message
          });
        });
    },

    updateUser() {
      updateUser(this.user)
        .then(response => {
          this.userMercury = response.data;
          this.tab = "2";
          this.$notify({
            title: "error",
            message: error.message
          });
        })
        .catch(error => {
          this.$notify.error({
            title: "error",
            message: error.message
          });
        });
    },

    updateUserChat() {

    }
  },
  mounted() {
    this.refresh();
    this.getUser();
    this.getAllBulkData();
  }
};
</script>

<style>
.form-container {
  margin: auto;

  max-width: 1024px;
}

.el-tab-pane {
  text-align: center;
}
td {
  width: 90px;
}
</style>
