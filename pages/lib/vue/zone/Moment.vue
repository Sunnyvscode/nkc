<template lang="pug">
  .single-moment-container(v-if="momentData")
    moment-status(ref="momentStatus" :moment="momentData" :permissions="permissions")
    .single-moment-top-container#comment-content
      //moment-option(
      //  ref="momentOption"
      //  @complaint="complaint"
      //)
      .single-moment-left
        .single-moment-avatar(
          data-global-mouseover="showUserPanel"
          data-global-mouseout="hideUserPanel"
          :data-global-data="objToStr({uid: momentData.uid})"
        )
          img(:src="momentData.avatarUrl")
        .single-moment-hits.m-t-1(v-if="type === 'details'")
          span 阅读
          span {{momentData.hits}}
      .single-moment-right(v-if="selectedMomentId !== momentData.momentId || submitting" )
        .single-moment-header
          .single-moment-user(
            data-global-mouseover="showUserPanel"
            data-global-mouseout="hideUserPanel"
            :data-global-data="objToStr({uid: momentData.uid})"
          )
            a(:href="momentData.userHome" target="_blank") {{momentData.username}}
          .single-moment-time
            from-now(:time="momentData.toc")
            span(v-if="momentData.tlm>momentData.toc" ) &nbsp;编辑于
            from-now(v-if="momentData.tlm>momentData.toc" :time="momentData.tlm"  )
            span &nbsp;IP:{{momentData.addr}}
          //- 其他操作
          .single-moment-tag(:class="momentData.visibleType" v-if="momentData.visibleType!=='everyone'") {{visitType[momentData.visibleType]}}
          .single-moment-header-options.fa.fa-ellipsis-h(@click="openOption($event)" data-direction="down")
          moment-option(
            ref="momentOption"
            @complaint="complaint"
            @selectedMomentId="handleMid"
          )
        //- 动态内容
        .single-moment-content(v-if="type === 'details'" v-html="momentData.content")
        .single-moment-content.simple.pointer(v-else  ref="momentDetails" @click.prevent="handleClick")
          span(v-html="momentData.content" ref="momentDetailsContent" )
        .singe-moment-details(v-if="type !== 'details' && isFold"    @click.self="visitUrl(momentData.url, true)") 显示更多
        //- 图片视频
        .single-moment-files
          moment-files(:data="momentData.files")
        //- 引用内容
        .single-moment-quote(v-if="momentData.quoteData")
          moment-quote(:data="momentData.quoteData" :uid="momentData.uid")
        //- 底部的操作按钮
        .single-moment-options
          .single-moment-options-left(
            title="评论"
            :class="{'active': showPanelType === panelTypes.comment}"
            @click="showPanel(panelTypes.comment)"
            )
            .fa.fa-comment-o
            span(v-if="momentData.commentCount > 0") {{momentData.commentCount}}
          .single-moment-options-center(
            title="转发"
            :class="{'active': showPanelType === panelTypes.repost}"
            @click="showPanel(panelTypes.repost)"
            )
            .fa.fa-retweet
            span(v-if="momentData.repostCount > 0") {{momentData.repostCount}}
          .single-moment-options-right(
            title="点赞"
            :class="{'active': momentData.voteType === 'up'}"
            @click="vote"
            )
            .fa.fa-thumbs-o-up
            span(v-if="momentData.voteUp > 0") {{momentData.voteUp}}

        // 评论列表
        .single-moment-moments(v-if="showPanelType")
          moment-comments(
            ref="momentComments"
            :mid="momentData.momentId"
            :type="showPanelType"
            @post-comment="onPostComment"
            :focus="focus"
            :permissions="permissions"
            :mode="mode"
            )
      div(v-if="selectedMomentId === momentData.momentId && !submitting")
        .moment-editor-header
          .moment-editor-header-title.text-info 正在编辑电文：
          button.btn.btn-default.btn-xs(@click="submitting = true") 取消
        moment-editor(:mid="momentData.momentId" @published="onPublished" ref="momentEditor")

</template>

<style lang="less" scoped>
  @import "../../../publicModules/base";
  .single-moment-top-container{
    @avatarWidth: 4rem;
    @avatarWidthMin: 3rem;
    position: relative;
    padding-left: @avatarWidth + 1rem;
    min-height: @avatarWidth;

    .single-moment-left{
      position: absolute;
      top: 0;
      left: 0;
      width: @avatarWidth;
      .single-moment-avatar{
        height: @avatarWidth;
        width: @avatarWidth;
        border-radius: 50%;
        overflow: hidden;
        img{
          height: 100%;
          width: 100%;
        }
      }
    }
    .single-moment-right{

    }

    .single-moment-quote{
      width: 100%;
      max-width: 100%;
      padding: 1rem;
      border: 1px solid #d5d5d5;
      border-radius: 5px;
      background-color: #f6f2ee;
    }
    .single-moment-files{
      font-size: 0;
      max-width: 70%;
      @media(max-width: 768px) {
        max-width: 100%;
      }
    }
    .single-moment-options{
      position: relative;
      @padding: 3rem;
      height: @padding;
      line-height: @padding;
      padding-left: @padding;
      padding-right: @padding;
      font-size: 1.3rem;
      text-align: center;
      color: #3f3f3f;
      &>*{
        cursor: pointer;
        &.active{
          color: @accent;
        }
      }
      .single-moment-options-left{
        text-align: left;
        position: absolute;
        top: 0;
        left: 0;
        height: @padding;
        line-height: @padding;
        cursor: pointer;
        .fa{
          margin-right: 0.5rem;
        }
        span{
          font-size: 1.1rem;
        }
      }
      .single-moment-options-center{
        display: inline-block;
        padding: 0 1rem;
        .fa{
          margin-right: 0.5rem;
        }
        span{
          font-size: 1.1rem;
        }
      }
      .single-moment-options-right{
        position: absolute;
        top: 0;
        right: 0;
        height: @padding;
        line-height: @padding;
        cursor: pointer;
        text-align: right;
        .fa{
          margin-right: 0.5rem;
        }
        span{
          font-size: 1.1rem;
        }
      }
    }
  }
  .single-moment-bottom-container{
    padding-left: 5rem;
    //padding-right: 4rem;
    .single-moment-bottom{

    }
  }

  .single-moment-center-container{
    padding-left: 5rem;
    margin-bottom: 0.5rem;
    .single-moment-center-content{
      width: 100%;
      max-width: 100%;
      padding: 1rem;
      border: 1px solid #d5d5d5;
      border-radius: 5px;
      background-color: #f6f2ee;
    }
    .single-moment-top-container{
      padding-left: 0;
      padding-right: 0;
    }
    .single-moment-files{

    }
  }

  .moments-container{
    .moment-item{
      border-bottom: 1px solid #eee;
      padding-bottom: 0.3rem;
      margin-bottom: 1.5rem;
    }
    & .moment-item:last-child{
      border-bottom: none;
      margin-bottom: 0;
    }
  }

  .single-moment-header{
    padding-right: 8rem;
    margin-bottom: 0.5rem;
    @optionHeight: 2rem;
    position: relative;
    .single-moment-user{
      display: inline-block;
      margin-right: 0.5rem;
      font-weight: 700;
      font-size: 1.25rem;
      a{
        color: @primary;
      }
    }
    .single-moment-time{
      display: inline-block;
      font-size: 1rem;
      color: #555;
    }
    .single-moment-tag{
      display:inline-block;
      position:absolute;
      right: 2.2rem;
      top: 0;
      cursor: default;
      border-width: 1px;
      border-style: solid;
      font-size: 1rem;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      vertical-align: middle;
      border-radius: 4px;
      padding: 0 9px;
      height: 2rem;
      line-height: 2rem;
    }
    .own{
      border-color:#d9ecff;
      border-radius: 4px;
      background-color: #ecf5ff;
      color: #409eff;
    }
    .attention{
      border-color:#faecd8;
      background-color: #fdf6ec;
      color: #e6a23c;
    }
    .single-moment-header-options{
      height: @optionHeight;
      line-height: @optionHeight;
      text-align: center;
      width: @optionHeight;
      position: absolute;
      font-size: 1.5rem;
      color: #555;
      top: 0;
      right: 0;
      cursor: pointer;
    }
  }
  .single-moment-title{
    a{
      font-size: 1.3rem;
      font-weight: 700;
      color: #333;
    }
    margin-bottom: 0.5rem;
  }
  .single-moment-abstract{
    height: 7rem;
    @width: 9rem;
    .hideText(@line: 4);
    font-size: 1.25rem;
    &.cover{
      padding-left: @width + 1rem;
      position: relative;
    }
    .single-moment-cover{
      position: absolute;
      border-radius: 3px;
      top: 0;
      left: 0;
      height: 100%;
      width: @width;
      background-size: cover;
      background-position: center;
    }
  }
  .single-moment-content{
    &.simple{
      /* 移动端的样式 */
      @media (max-width: 767px) {
        .hideText(@line: 10);
      }
      /* PC 端样式 */
      @media (min-width: 767px) {
        .hideText(@line: 8);
      }
    }
    font-size: 1.25rem;
    color: #000;
    line-height: 2rem;
    margin-bottom: 0.5rem;
    word-break: break-word;
    word-wrap: break-word;
    white-space: pre-wrap;
    &/deep/ img{
      height: 1.5rem;
      width: 1.5rem;
      margin: 0 0.1rem;
      vertical-align: text-bottom;
    }
    &/deep/ a{
      color: @primary;
    }
  }
  .single-moment-comment-container{
    background-color: #fff;
    border: 1px solid #ccc;
    padding: 1rem 1rem 0.5rem 1rem;
    border-radius: 5px;
    margin-bottom: 1rem
  }
  .singe-moment-details{
    color: rgb(29, 155, 240);
    display: inline-block;
    cursor: pointer;
  }
  .singe-moment-details:hover{
    text-decoration: underline;
  }
  .moment-editor-header{
    @momentEditorHeader: 2.5rem;
    height: @momentEditorHeader;
    padding-right: 6rem;
    position: relative;
    .moment-editor-header-title{
      height: @momentEditorHeader;
      line-height: @momentEditorHeader;
    }
    button{
      position: absolute;
      top: 0;
      right: 0;
    }
  }
  .single-moment-hits{
    &>span:first-of-type{
      display: block;
      margin-bottom: 0.2rem;
    }
    text-align: center;
    color: rgb(85,85,85);
    font-size: 12px;
  }
  //.content-fold{
  //  height: 200px;
  //  overflow: hidden;
  //}

</style>

<script>
  import {momentVote} from "../../js/zone/vote";
  import {sweetError} from "../../js/sweetAlert";
  import {objToStr} from "../../js/tools";
  import FromNow from '../../../lib/vue/FromNow';
  import MomentFiles from './MomentFiles';
  import MomentComments from './MomentComments';
  import MomentQuote from './MomentQuote';
  import MomentStatus from "./MomentStatus";
  import {visitUrl} from "../../js/pageSwitch";
  import MomentOptionFixed from "./momentOption/MomentOptionFixed";
  import {getState} from "../../js/state";
  import {toLogin} from "../../js/account";
  import MomentEditor from "./MomentEditor.vue";

  const state = getState();
  export default {
    components: {
      'from-now': FromNow,
      'moment-files': MomentFiles,
      'moment-comments': MomentComments,
      'moment-quote': MomentQuote,
      'moment-status': MomentStatus,
      'moment-option': MomentOptionFixed,
      "moment-editor":MomentEditor
    },
    /*
    * prop {Object} data 动态用于显示的数据 组装自 MomentModel.statics.extendMomentsListData
    * prop {String} focus 高亮的评论ID
    * prop {String} type 当前组件在哪里，详情页（details）或者动态列表
    * */
    props: ['data', 'focus', 'permissions', 'mode', 'type'],
    data: () => ({
      logged: !!state.uid,
      momentData: null,
      showPanelType: '', // comment, repost
      panelTypes: {
        comment: 'comment',
        repost: 'repost'
      },
      submitting:false,
      timer: null,
      selectedMomentId:'',
      isFold:false, //是否折叠
      visitType:{
        own:'自己可见',
        attention:'关注可见'
      }
    }),
    mounted() {
      this.initData();
    },
    computed: {
      focusCommentId() {
        return this.focus;
      },
    },
    destroyed() {
      this.clearTimer();
    },
    methods: {
      objToStr: objToStr,
      visitUrl,
      clearTimer() {
        clearTimeout(this.timer);
      },
      handleClick(){
        // 检查是否为选中文本
        const selectedText = window.getSelection().toString();
        if (selectedText) {
          // 用户选中了文本，不执行后续操作
          return;
        }
        this.visitUrl(this.momentData.url, true);
      },
      initData() {
        const {data} = this;
        this.momentData = JSON.parse(JSON.stringify(data));
        this.showLoadMore();
      },
      vote() {
        if(!this.logged) return toLogin();
        const {momentId, voteType} = this.momentData;
        const self = this;
        const voteUpType = 'up';
        const cancel = voteType === voteUpType;
        momentVote(momentId, voteUpType, cancel)
          .then(res => {
            const {voteUp} = res;
            self.momentData.voteType = cancel? '': voteUpType;
            self.momentData.voteUp = voteUp;
          })
          .catch(sweetError);
      },
      showPanel(type) {
        if(this.showPanelType === type) {
          this.showPanelType = '';
        } else {
          this.showPanelType = type;
        }
        this.setTimerToInitComments();
      },
      setTimerToInitComments() {
        const self = this;
        self.clearTimer();
        this.timer = setTimeout(() => {
          if(self.$refs.momentComments) {
            self.$refs.momentComments.init();
          } else {
            self.setTimerToInitComments();
          }
        }, 200);
      },
      showCommentPanel() {
        this.showPanel(this.panelTypes.comment);
      },
      onPostComment() {
        this.momentData.commentCount ++;
      },
      //打开其他操作
      openOption(e) {
        const target = e.target;
        const init = $(target).attr('data-init');
        if(init === 'true') return;
        this.$refs.momentOption.open({DOM: $(target), moment: this.momentData});
        //阻止浏览器默认事件 阻止事件冒泡
        // e.preventDefault();
      },
      //投诉或举报
      complaint(mid) {
        this.$emit('complaint', mid);
      },
      handleMid(mid){
        this.submitting = false;
        this.selectedMomentId = mid;
      },
      // setFold(){
      //   if(this.type !== 'details'){
      //     this.$nextTick(() => {
      //       const childNodes =  Array.from(this.$refs.momentDetails.childNodes);
      //       let text = ''
      //       let startIndex = -1;
      //       let lastNode;
      //       for (let i = 0; i < childNodes.length; i++ ) {
      //         const node = childNodes[i]
      //         if (node.nodeType === Node.TEXT_NODE && text.length<=200) {
      //           text += node.textContent;
      //           lastNode = node
      //         }
      //         if (startIndex === -1 && text.length > 200) {
      //           startIndex = i + 1; // 记录要删除的起始下标
      //           break;
      //         }
      //       }
      //       if (startIndex !== -1) {
      //         for (let i = startIndex; i < childNodes.length; i++) {
      //           const node = childNodes[i];
      //           this.$refs.momentDetails.removeChild(node); // 从 DOM 中删除节点
      //         }
      //       }
      //       if(text.length>200){
      //         const overLength = text.length - 200;
      //         const newNodeText = lastNode.textContent.substring(0,lastNode.textContent.length - overLength) + '...';
      //         const newNode = document.createTextNode(newNodeText);
      //         this.$refs.momentDetails.replaceChild(newNode, lastNode); // 替换超出部分的节点
      //       }
      //       this.isFold = text.length>200
      //     });
      //   }
      // },
      //显示是否加载更多
      showLoadMore(){
        this.$nextTick(()=>{
          const momentDetailsHeight = this.$refs.momentDetails.clientHeight
          const momentDetailsContentHeight = this.$refs.momentDetailsContent.getBoundingClientRect().height
          this.isFold = momentDetailsContentHeight > momentDetailsHeight;
        })
      },
      onPublished(data) {
        const {content,submitting,files,status,tlm,addr} = data
        this.momentData.content = content;
        this.momentData.status = status
        this.submitting = submitting;
        this.momentData.files = files
        this.momentData.tlm = tlm;
        this.momentData.addr = addr;
        this.$refs.momentEditor.reset();
        this.showLoadMore()
      },
    }
  }
</script>
