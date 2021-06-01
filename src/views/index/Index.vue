<template>
  <div class="container">
    <el-row>
      <el-col :offset="10" :span="4">
        <img src="../../assets/images/logo.png" class="logo" alt="dataai" />
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8" :offset="8" class="center">
        <el-input
            v-model="keywords"
            @focus="focus"
            @blur="blur"
            @input="getSuggest"
            @keyup.enter.native="searchHandler"
            placeholder="请输入关键词进行搜索"
        >
          <el-button slot="append" type="primary" icon="el-icon-search" @click="searchHandler">搜索</el-button>
        </el-input>
        <el-card
            @mouseenter="enterSearchBoxHandler"
            v-if="isSearch"
            class="box-card"
            id="search-box"
            style="position:relative;z-index:15"
        >
          <dl v-if="isHistorySearch">
            <dt class="search-title" v-show="history">历史搜索</dt>
            <dt class="remove-history" v-show="history" @click="removeAllHistory">
              <i class="el-icon-delete"></i>清空历史记录
            </dt>
            <el-tag
                v-for="(search, index) in historySearchList"
                :key="index"
                closable
                :type="search"
                @click="toSearch(search)"
                @close="closeHandler(search)"
                style="margin-right:5px; margin-bottom:5px;"
            >{{search}}</el-tag>
            <dt class="search-title">热门搜索</dt>
            <el-tag
                v-for="(search, index) in hotSearchList"
                :key="index"
                closable
                :type="search"
                @click="toSearch(search)"
                @close="closeHandler(search)"
                style="margin-right:5px; margin-bottom:5px;"
            >{{search}}</el-tag>
          </dl>
          <dl v-if="isSearchList">
            <dd v-for="search in searchList" @click="toSearch(search)" :key="search.id">{{search}}</dd>
          </dl>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>

export default {
  data() {
    return {
      keywords: "", //当前输入框的值
      isFocus: false, //是否聚焦
      hotSearchList: ["暂无热门搜索"], //热门搜索数据
      historySearchList: [], //历史搜索数据
      searchList: ["暂无数据"], //搜索返回数据,
      history: false,
    };
  },
  mounted() {
    this.getHotSearch()
  },
  methods: {
    focus() {
      this.isFocus = true;
      this.historySearchList = JSON.parse(localStorage.getItem("searchHistory")) == null ? [] : JSON.parse(localStorage.getItem("searchHistory"))
      this.history = this.historySearchList.length !== 0;
    },
    blur() {
      let self = this;
      this.searchBoxTimeout = setTimeout(function() {
        self.isFocus = false;
      }, 300);
    },
    getSuggest() {
      if(this.keywords) {this.axios.post('http://dataai.pro/api/suggest', {'s':this.keywords}).then((res) => {
        if (res.data.status === 'success') {
          this.searchList = res.data.data
        }
      })}
    },
    getHotSearch() {
      this.axios.get('http://dataai.pro/api/hot').then((res) => {
        if (res.data.status === 'success') {
          this.hotSearchList = res.data.data
        }
      })
    },
    enterSearchBoxHandler() {
      clearTimeout(this.searchBoxTimeout);
    },
    toSearch(value) {
      this.$router.push({ name: 'result', params: { q: value }})
    },
    // 处理搜索
    searchHandler() {
      let exist =
          this.historySearchList.filter(value => {
            return value === this.keywords;
          }).length === 0 ? false : true;
      if (!exist && this.keywords) {
        this.historySearchList.push(this.keywords);
        localStorage.setItem("searchHistory", JSON.stringify(this.historySearchList))
      }
      this.history = this.historySearchList.length !== 0;
      this.$router.push({path:'result',query:{q:this.keywords}})
    },
    closeHandler(search) {
      this.historySearchList.splice(this.historySearchList.indexOf(search), 1);
      localStorage.setItem("searchHistory", JSON.stringify(this.historySearchList))
      clearTimeout(this.searchBoxTimeout);
      if (this.historySearchList.length === 0) {
        this.history = false;
      }
    },
    removeAllHistory() {
      localStorage.removeItem("searchHistory")
    }
  },
  computed: {
    isHistorySearch() {
      return this.isFocus && !this.keywords;
    },
    isSearchList() {
      return this.isFocus && this.keywords;
    },
    isSearch() {
      return this.isFocus;
    }
  }
};
</script>

<style lang="scss">
.container{
  margin-top: 100px;
  .logo{
    width: 277px;
    height: 120px;
  }
  #search {
    background-color: #4584bc;
  }
}
.left {
  margin-left: 200px;
}
.center {
  margin-top: 15px;
  margin-left: 200px;
}
.search-title {
  color: #bdbaba;
  font-size: 15px;
  margin-bottom: 5px;
}
.remove-history {
  color: #bdbaba;
  font-size: 15px;
  float: right;
  margin-top: -22px;
}
#search-box {
  width: 555px;
  height: 300px;
  margin-top: 0;
  padding-bottom: 20px;
}
</style>
