<template>
  <div class="main">
    <div class="title">
      <a href="/">
        <div class="logo"></div>
      </a>
    </div>
    <div class="search">
      <input type="text" placeholder="请输入关键词进行搜索" v-model="keywords" class="searchInput" />
      <div class="searchButton" @click="addSearch">搜索</div>
      <ul class="suggestList"></ul>
    </div>
    <div class="history">
      <div class="hotSearch">
        <span>热门搜索：</span>
        <ul>
          <li v-for="(key, value) in hotSearch" :key="key">
            {{key}}
            {{value}}
            <a :href="value">{{key}}</a>
          </li>
        </ul>
      </div>
      <div class="mySearch">
        <span>我的搜索：</span>
        <ul>
          <li v-for="(item, index) in mySearch" :key="index">
            <a :href=item.url>{{item.keywords}}</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="foot">
      <div class="copyright">Copyright 版权所有 E-mail:search@dataai.cn</div>
    </div>
  </div>
</template>

<script>

export default {
  name: "Index",
  mounted() {
    this.MapSearchArr();
  },
  data() {
    return {
      keywords: "",
      searchArr: ["abc"],
      hotSearch:["我们", "是", "搜", "索"],
      mySearch: [],
    }
  },

  methods: {
    submit() {
      this.form
          .transform(data => ({
            ...data,
          }))
          .post(this.route('login'), {
            onFinish: () => this.form.reset('password'),
          })
    },
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
    removeByValue(arr, val) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === val) {
          arr.splice(i, 1);
          break;
        }
      }
    },
    MapSearchArr() {
      let arrLen = 0
      let url = ""
      if (this.searchArr.length >= 5) {
        arrLen = 5
      } else {
        arrLen = this.searchArr.length
      }
      this.mySearch = []
      for (let i = 0; i < arrLen; i++) {
        url = "http://dataai.pro/result?q=" + this.searchArr[i];
        this.mySearch.push({"url": url, "keywords": this.searchArr[i]})
      }
      console.log("vvv")
      console.log(this.mySearch)
    },
    addSearch() {
      if (this.keywords.length >= 2) {
        //点击搜索按钮时，去重
        this.killRepeat(this.keywords);
        //去重后把数组存储到浏览器localStorage
        localStorage.search = this.searchArr;
        //然后再把搜索内容显示出来
        this.MapSearchArr();
      }
      this.$router.push({path:'result',query:{q:this.keywords}})
    }
  }
}
</script>

<style scoped lang="scss">
.main{
  width: 50%;
  margin: 100px auto 0;
  min-height: 500px;
  .title{
    .logo{
      margin: 0 auto;
      width: 320px;
      height: 130px;
      background: url(../../assets/images/logo.png) no-repeat center center;
      background-size: 320px 130px;
    }
  }
  .search{
    position: relative;
    margin-bottom: 65px;
    .searchInput{
      display: inline-block;
      border: 1px solid #bfbfbf;
      padding: 0 15px;
      outline: none;
      height: 40px;
      line-height: 40px;
      width: 670px;
    }
    .searchInput:focus{
      outline: none;
    }
    .searchButton{
      position: absolute;
      display: inline-block;
      width: 80px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      background-color: #4584bc;
      color: #ffffff;
      cursor: pointer;
    }
  }
  .history{
    .hotSearch, .mySearch{
      margin-top: 15px;
    }
    ul{
      display: inline-block;
      li{
        margin-left: 10px;
        display: inline-block;
        a{
          color: #4584bc;
        }
      }
    }
  }
  .foot{
    position: absolute;
    bottom: 0;
    width: 100%;
    left: 0;
    .copyright{
      position: relative;
      text-align: center;
      color: #ababab;
      top: -35px;
    }
  }
}
</style>
