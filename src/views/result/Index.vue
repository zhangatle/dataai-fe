<template>
  <div id="main">
    <div class="logout" style="z-index: 99">
      <el-button type="primary" @click="logout">登出</el-button>
    </div>
    <el-container>
      <el-header>
        <el-row>
          <el-col :span="2">
            <a href="/">
              <div class="logo">
                <img src="../../assets/images/logo.png" class="logo" alt="dataai" />
              </div>
            </a>
          </el-col>
          <el-col :span="6">
            <el-input type="text" placeholder="请输入关键词进行搜索" v-model="keywords">
              <el-button slot="append" @click="addSearch">搜索</el-button>
            </el-input>
          </el-col>
        </el-row>
      </el-header>
      <el-container>
        <el-main>
          <el-row>
            <el-col :span="10" :offset="2">
              <span class="summary">找到约&nbsp;<span class="totalResult">{{ total }}</span>&nbsp;条结果(用时<span
                  class="time">{{ last_seconds }}</span>秒)，共约<span class="totalPage">{{ page_nums }}</span>页</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :offset="2">
              <div class="resultList">
                <div class="resultItem" v-for="(item,index) in hit_list" :key="index">
                  <div class="itemHead">
                            <span class="from">
                              <span class="label">来源：</span>
                              <span class="value">{{ item.nickname }}({{ item.wxid }})</span>
                            </span>
                    <span class="dependValue">
                              <span class="label">得分：</span>
                              <span class="value">{{ item.score }}</span>
                            </span>
                  </div>
                  <div class="itemBody" v-html="item.content"></div>
                  <div class="itemFoot">
                            <span class="info">
                              <label>发送人：</label>
                              <span class="value">{{ item.message_sender }}</span>
                            </span>
                    <span class="info">
                              <label>群昵称：</label>
                              <span class="value">{{ item.message_group }}</span>
                            </span>
                    <span class="info">
                              <label>发布时间：</label>
                              <span class="value">{{ item.create_date }}</span>
                            </span>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-main>
        <el-aside width="300px">
          <div class="historyArea">
            <div class="hotSearch">
              <h6>热门搜索</h6>
              <div class="historyList">
              <p  v-for="(item, index) in hotSearchList" :key="index" @click="changeKeywords(item)">
                {{item}}
              </p>
              </div>
            </div>
            <div class="mySearch">
              <h6>我的搜索</h6>
              <div class="historyList">
              <p  v-for="(item, index) in mySearchList" :key="index" @click="changeKeywords(item)">
                {{item}}
              </p>
              </div>
            </div>
          </div>
        </el-aside>
      </el-container>
      <el-footer>
        <el-row>
          <el-col align="left" :offset="2">
            <el-pagination
                background
                layout="prev, pager, next"
                :current-page=Number(this.page)
                @current-change="changePage"
                :page-size=10
                :total="this.total">
            </el-pagination>
          </el-col>
        </el-row>
        <div class="footer">
          Copyright 版权所有 E-mail:search@dataai.cn
        </div>
      </el-footer>
    </el-container>

  </div>
</template>

<script>
import * as types from "../../store/types";

export default {
  name: "Result",
  mounted() {
    this.getQuery();
    this.addSearch();
    this.getSearchList();
  },
  data() {
    return {
      keywords: "",
      total: 0,
      page: 1,
      page_nums: 0,
      last_seconds: 0,
      hit_list: [],
      hotSearchList: ["热门词"],
      mySearchList: ["第一"],
    }
  },

  methods: {
    getQuery() {
      this.keywords = this.$route.params.q;
    },
    getSearchList() {
      this.axios.get('http://dataai.pro/api/hot').then((res) => {
        console.log(res.data)
        if (res.data.status === 'success') {
          this.hotSearchList = res.data.data
        }
      })
      this.mySearchList = JSON.parse(localStorage.getItem("searchHistory")) == null ? [] : JSON.parse(localStorage.getItem("searchHistory"))
    },
    changeKeywords(keywords) {
      this.keywords = keywords
      this.addSearch()
    },
    changePage(page) {
      this.page = page
      this.addSearch()
    },
    logout() {
      console.log('asdf')
      this.axios.get('http://dataai.pro/api/logout').then((res) => {
        if (res.data.status === 'success') {
          console.log(res.data)
          this.$store.commit(types.LOGIN, "")
          this.$router.push({path: 'login'})
        }
      })},
    addSearch() {
      if (this.keywords && this.keywords.length >= 2) {
        let exist =
            this.mySearchList.filter(value => {
              return value === this.keywords;
            }).length === 0 ? false : true;
        if (!exist) {
          this.mySearchList.push(this.keywords);
          localStorage.setItem("searchHistory", JSON.stringify(this.mySearchList))
        }
        let url = "http://dataai.pro/api/search?q=" + this.keywords + "&p="+this.page;
        this.axios.get(url).then(
            res => {
              let data = res.data.data;
              this.count = data.count
              this.hit_list = data.hit_list
              // this.keywords = data.keywords
              this.last_seconds = data.last_seconds
              this.page = data.page
              this.page_nums = data.page_nums
              // this.hot_search = data.hot_search
              this.total = data.total
            }
        ).catch(
            error => {
              console.log(error)
            }
        )
      }
    }
  }
}
</script>
<style>
.keyword{
  color: red;
}
</style>
<style lang="scss" scoped>
#main {
  height: 100%;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  .el-container {
    min-height: 100%;
  }
  .el-header{
    .logo{
      width: 100px;
      height: 40px;
    }
  }

  .el-header, .el-footer {
    color: #333;
    text-align: center;
    height: 60px !important;
  }

  .el-aside {
    color: #333;
    text-align: center;
    line-height: 20px;
  }

  .el-main {
    .summary{
      color: gray;
    }
    .resultList {
      margin-top: 10px;
      .resultItem {
        padding-bottom: 10px;
      }
      .itemHead {
        margin-bottom: 5px;
        color: #767676;
        font-size: 14px;
        .keyword {
          color: #d90909;
        }
        .value {
          color: #4584bc;
        }
        .from {
          margin-right: 10px;
        }
      }
      .itemBody {
        margin-bottom: 5px;
        line-height: 18px;
        font-size: 18px;
        width: 90%;
      }

      .itemFoot {
        margin-bottom: 20px;
        font-size: 14px;
        .info {
          margin-right: 10px;
        }
        .value {
          color: #4584bc
        }
      }
    }
  }
}
.footer{
  text-align: center;
}

.historyArea{
  text-align: left;
  h6{
    font-size: 20px;
  }
  p{
    cursor: pointer;
    color: #0080cc;
    font-size: 16px;
    height: 20px;
    line-height: 20px;
  }
}
.pagination{
  float: left;
}

.logout{
  position: absolute;
  right: 20px;
  top: 20px;
}

</style>
