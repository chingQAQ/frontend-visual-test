# frontend-visual-testing

此工具包以[backstopJS][1]作為前端視覺測試，並加入自動化，照著本流程就可以輕鬆跑測試。\
實作的目的為避免多人協作、以及components之間修改造成頁面有非預期的變化\
有任何問題請用 issues 提出或是 pull resuest

[1]: https://github.com/garris/BackstopJS

## 注意

- 請升級至 Node v12 以上
- (建議) merge及init執行一次就好，設定後路徑需要更改請手動設定
- 目前只有頁面測試，元件測試開發中...

## 說明

#### 檔案結構

```
root/
|
|– test/
|   |– .config                   // init後會出現的路徑檔及viewport設定
|   |– package.json              // 跟root的package.json合併後刪除
|   |– visual-testing-config.js  // 設定檔
|   |– visual-testing-init.js    // 初始化
|   |– visual-testing-merge.js   // 跟root的package.json合併
|   |– visual-testing.js         // test entry
|
|– node_modules/


```

#### 功能

- 比對reference及現有畫面的差異
- 利用approve指令確認修改及覆蓋reference
- 找破版及元件修改方便

## 使用

1. 請先安裝 [Node.js][d51f406f]、 [git for Window][2502918c]
2. clone 此工具包
3. `cd test` 後進入 clone 下來的工具包，並執行以下 npm script，進行測試檔案設定
   ```
   npm run visual_testing_merge
   ```
4. `cd ..`回到開發根目錄，執行安裝 package
   ```
   npm install
   ```
5. 執行以下 npm script初始化工具包 *注意:請使用管理員權限開啟vscode，否則無法搬運檔案會造成錯誤。
   ```
   npm run visual_testing_init
   ```
   
初始化會出現一些問答，這是為了建立測試設定檔

*最後要加斜線
```
請輸入頁面資料夾位置 ex: dist/views/, dist/
./index.html > ./
dist/index.html > dist/
abc/def/ghi/index.html > abc/def/ghi/
```

輸入port號
```
請輸入port default:4000
```

選擇要測試的裝置寬度
```
請選擇欲測試之裝置寬度(可複選)
```
之後請至.config手動新增\
輸入後等待初始化完成就可以利用`npm run visual_testing_reference`開始測試


#### npm script

`npm run visual_testing_merge`  
將測試需要的npm scripts 跟 devDependencies 合併到root/pcakage.json，並且新增ignore至.gitignore 

`npm run visual_testing_init`  
生成測試用到的檔案，刪除backstop.config這支預設檔案，並執行搬移生成的檔案 (請使用管理員權限開啟vscode)

`npm run visual_testing_reference`  
將目前的頁面快照下來當作範本，與後續頁面做比對  

`npm run visual_testing_test`  
將當前頁面與範本做比對，完成後會有獨立視窗

`npm run visual_testing_approve`  
當前頁面與範本有衝突時，執行此script允許變更並替換範本

**參數**

`npm run visual_testing_test --p [xxxx.html]` 

加入`--p`後可單一測試頁面



[d51f406f]: https://nodejs.org/en/ 'Node.js'
[2502918c]: https://git-scm.com/ 'git for Window'

