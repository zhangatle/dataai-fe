<template>
  <el-container>
    <div style="height: 100%">
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
                            <span class="fileType">
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
        </el-container>
        <el-aside width="300px">
          <div class="historyArea">
            <div class="hotSearch">
              <h6>热门搜索</h6>
              <div class="historyList">
              <span  v-for="(item, index) in hot_search" :key="index">
                <el-link href="/">{{ item }}</el-link><el-divider></el-divider>
              </span>
              </div>
            </div>
            <div class="mySearch">
              <h6>我的搜索</h6>
              <div class="historyList">
              <span  v-for="(item, index) in searchArr" :key="index">
                <el-link href="/">{{ item }}</el-link><el-divider></el-divider>
              </span>
              </div>
            </div>
          </div>
        </el-aside>
      </el-container>
    </div>
    <el-footer>
      <div class="pagination">
        <el-row>
          <el-col :offset="2">
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
      </div>
      <div class="footer">
        Copyright 版权所有 E-mail:search@dataai.cn
      </div>
    </el-footer>
  </el-container>
</template>

<script>

export default {
  name: "Result",
  mounted() {
    this.getQuery();
    this.addSearch();
  },
  data() {
    return {
      keywords: "",
      total: 0,
      page: 1,
      page_nums: 0,
      last_seconds: 0,
      hit_list: [],
      hot_search: ["热门词"],
      searchArr: ["第一"],
    }
  },

  methods: {
    getQuery() {
      this.keywords = this.$route.params.q;
    },
    changePage(page) {
      this.page = page
      this.addSearch()
    },
    addSearch() {
      if (this.keywords.length >= 2) {
        console.log(123)
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
            console.log(data.page_nums)
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
</script>
<style>
.keyword {
  color: #d90909;
}
</style>
<style scoped lang="scss">
.logo{
  width: 100px;
  height: 40px;
}
.summary{
  color: gray;
}
.resultList {
  margin-top: 10px;
  .resultItem {
    padding-bottom: 20px;
  }

  .itemHead {
    margin-bottom: 5px;
    color: #767676;
    font-size: 12px;

    .keyword {
      color: #d90909;
    }

    a.title {
      font-size: 16px;
      color: #0080cc;
      text-decoration: underline;
    }

    .value {
      color: #4584bc;
    }

    .divsion {
      margin: 0 5px;
    }

    .fileType {
      margin-right: 10px;
    }
  }

  .itemBody {
    margin-bottom: 5px;
    line-height: 18px;
    width: 90%;
  }

  .itemFoot {
    margin-bottom: 20px;
    font-size: 12px;

    .info {
      margin-right: 10px;
    }

    .value {
      color: #4584bc
    }
  }
}

.footer{
  text-align: center;
}

.historyArea{
  position: absolute;
  right: 100px;
  top: 100px;
  width: 200px;
  h6{
    font-size: 18px;
  }
  .el-link{
    color: #0080cc;
    font-size: 16px;
  }
}
</style>
