<template>
  <div class="container">
    <div class="header">
      <a href="/"><div class="logo"></div></a>
      <div class="inputArea">
        <input type="text" class="searchInput" placeholder="请输入关键词进行搜索" v-model="keywords"/>
        <div class="searchButton" @click="addSearch">搜索</div>
      </div>
    </div>

    <div class="main">
      <div class="resultArea">
        <p class="resultTotal">
          <span class="info">找到约&nbsp;<span class="totalResult">{{ total }}</span>&nbsp;条结果(用时<span class="time">{{ last_seconds }}</span>秒)，共约<span class="totalPage">{{page_nums }}</span>页</span>
        </p>
        <div class="resultList">
          <div class="resultItem"  v-for="(item,index) in hit_list" :key="index">
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
        <!-- 分页 -->
        <div class="pagination ue-clear"></div>
        <!-- 相关搜索 -->
      </div>
      <div class="historyArea">
        <div class="hotSearch">
          <h6>热门搜索</h6>
          <ul class="historyList">
            <li v-for="(item, index) in hot_search" :key="index">
              <a href="/result?q=a">{{ index + 1 }}:{{ item }}</a>
            </li>
          </ul>
        </div>
        <div class="mySearch">
          <h6>我的搜索</h6>
          <ul class="historyList">
          </ul>
        </div>
      </div>
    </div>
  </div>
  <!--        <div id="foot">Copyright 版权所有 E-mail:search@dataai.cn</div>-->
</template>

<script>

export default {
  name: "Result",
  mounted() {
    this.mapSearchArr();
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
      hot_search: [],
      searchArr: [],
    }
  },

  methods: {
    // 去重
    killRepeat(val) {
      let kill = 0;
      for (let i = 0; i < this.searchArr.length; i++) {
        if (val === this.searchArr[i]) {
          kill++;
        }
      }
      if (kill < 1) {
        this.searchArr.unshift(val)
      } else {
        this.removeByValue(this.searchArr, val)
        this.searchArr.unshift(val)
      }
    },
    mapSearchArr() {
      let arrLen = 0
      let url = ""
      if (this.searchArr.length >= 5) {
        arrLen = 5
      } else {
        arrLen = this.searchArr.length
      }
      this.mySearch = []
      for (let i = 0; i < arrLen; i++) {
        url = "http://dataai.pro/api/result?q=" + this.searchArr[i];
        this.mySearch.push({"url": url, "keywords": this.searchArr[i]})
      }
    },
    addSearch() {
      if (this.keywords.length >= 2) {
        //点击搜索按钮时，去重
        this.killRepeat(this.keywords);
        //去重后把数组存储到浏览器localStorage
        localStorage.search = this.searchArr;
        //然后再把搜索内容显示出来
        this.mapSearchArr();
      }
      let url = "http://dataai.pro/api/search?q=" + this.keywords;
      this.axios.get(url).then(
          res => {
            let data = res.data.data;
            this.count = data.count
            this.hit_list = data.hit_list
            this.keywords = data.keywords
            this.last_seconds = data.last_seconds
            this.page = data.page
            this.page_nums = data.page_nums
            this.hot_search = data.hot_search
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
.keyword{
  color: #d90909;
}
</style>
<style scoped lang="scss">
.container {
  margin: 20px 100px 0;

  .header {
    margin-bottom: 20px;
    height: 52px;

    .logo {
      float: left;
      margin-right: 30px;
      width: 128px;
      height: 52px;
      background: url(../../assets/images/logo.png) no-repeat center center;
      background-size: 128px 52px;
    }

    .inputArea {
      float: left;
      position: relative;

      .searchInput {
        display: inline-block;
        border: 1px solid #bfbfbf;
        padding: 0 15px;
        outline: none;
        height: 52px;
        line-height: 35px;
        width: 350px;
        border-right: none;
      }

      .searchButton {
        display: inline-block;
        float: right;
        width: 106px;
        height: 52px;
        line-height: 52px;
        text-align: center;
        background-color: #4584bc;
        cursor: pointer;
      }
    }
  }

  .main {
    padding-right: 215px;

    .resultArea {
      float: left;
      width: 100%;
      .resultTotal{
        position: relative;
        padding-left: 30px;
        margin-bottom: 20px;
        .info{
          color: #9a9a9a;
        }
        .orderOpt{
          position: absolute;
          right: 50px;
          a{
            margin-right: 10px;
            color: #0080cc;
          }
        }
      }
      .resultList{
        padding-left: 30px;
        .resultItem{
          margin-bottom: 20px;
        }
        .itemHead{
          margin-bottom: 5px;
          color: #767676;
          font-size: 12px;
          .keyword{
            color: #d90909;
          }
          a.title{
            font-size: 16px;
            color: #0080cc;
            text-decoration: underline;
          }
          .value{
            color: #4584bc;
          }
          .divsion{
            margin: 0 5px;
          }
          .fileType{
            margin-right: 10px;
          }
        }
        .itemBody{
          margin-bottom: 5px;
          line-height: 18px;
          width: 90%;
        }
        .itemFoot{
          margin-bottom: 20px;
          font-size: 12px;
          .info{
            margin-right: 10px;
          }
          .value{
            color: #4584bc
          }
        }
      }
      .pagination{
        margin-bottom: 25px;
        padding-left: 32px;
        .dependSearch{
          margin-bottom: 30px;
          padding-left: 32px;
          font-size: 14px;
          h6{
            float: left;
            margin-right: 15px;
            font-weight: bold;
          }
          p{
            margin-bottom: 5px;
          }
          a{
            display: inline-block;
            margin-right: 15px;
            text-decoration: underline;
            width: 90px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
      .searchInResult{
        padding-left: 35px;
        .inResult{
          position: absolute;
          right: -190px;
          top: 8px;
          font-size: 14px;
          text-decoration: underline;
        }
        .searchButton{
          left: 417px;
        }
      }
    }

    /*历史搜索区域*/
    .historyArea {
      float: right;
      margin-right: -212px;
      width: 212px;

      .hotSearch {
        h6 {
          margin-bottom: 10px;
          font-weight: bold;
        }

        .historyList {
          margin-bottom: 20px;

          li {
            margin-bottom: 5px;
          }
        }
      }
    }
  }
}

</style>
