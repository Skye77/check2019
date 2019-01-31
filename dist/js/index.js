layui.use(['form','element','laydate','table'], function(){
	var $ = layui.$, element = layui.element, layer = layui.layer,
		laydate = layui.laydate, table = layui.table, form = layui.form;
	//待审核表格----默认加载
	waitTable(table,$);//待审核表格列表
	waitCf(table,$);//待审核处方单
	waitHis(table,$);//待审核历史处方列表
  	var active = {
	  	tabChange: function(id,type){
	  		console.log(type,id)
	      	element.tabChange('headtab',id);
	      	$('.che-info').hide();
	      	$(type).show();
	      	if(id == "1"){
	      		waitTable(table,$);//待审核表格列表
				waitCf(table,$);//待审核处方单
				waitHis(table,$);//待审核历史处方列表
	      	}else if(id == "2"){
	      		notTable(table,$);//审核不通过列表
	      	}else{
	      		yesTable(table,$);//审核通过列表
				yesCf(table,$);//审核通过处方单
	      	}
	   	}
	  	,checkTg: function(){//待审核-审核通过
	      	layer.open({
		        type: 1
		        ,title: ['审核提示','font-size:14px;color:#323232;background-color:#F6F7FB;padding-left:15px']
		        ,offset: "auto"
		        ,id: 'layerDemoauto1'
		        ,skin: 'che-mod'
		        ,area: ['30%', 'auto']
		        ,content: '<div class="chemod1">确定当前患者<span class="fcblue">（张瑞政）</span>的处方单通过审核？</div>'
		        ,btn: ["通过","取消"]
		        ,btnAlign: 'r'
		        ,shade: 0.3
		        ,shadeClose: true
		        ,closeBtn: 0
		        ,anim: 5//渐显
		        ,yes: function(index, layero){
		          	alert('通过')
		        }
		        ,btn2: function(){
		        	layer.closeAll();
			  	}
	      	});
   	 	}
	  	,checkDh: function(){//待审核-打回
	  		layer.open({
		        type: 1
		        ,title: ['处方单打回','font-size:14px;color:#323232;background-color:#F6F7FB;padding-left:15px']
		        ,offset: "auto"
		        ,id: 'layerDemoauto2'
		        ,skin: 'che-mod-dh'
		        ,area: ['45%', 'auto']
		        ,content: $('#commentCont')
		        ,btn: ["打回","取消"]
		        ,btnAlign: 'r'
		        ,shade: 0.3
		        ,shadeClose: false
		        ,closeBtn: 0
		        ,anim: 5//渐显
		        ,yes: function(index, layero){
		          	alert('打回')
		        }
		        ,btn2: function(){
		        	layer.closeAll();
			  	}
	      	});
	  	},
	  	modSear: function(){
	  		alert('模糊查询')
	  	}
  	}
  	//tab切换
  	$('#headtab li').on('click', function(){
	    var obj = $(this);
	    obj.addClass('active').siblings('li').removeClass('active');
	    active.tabChange(obj.attr("lay-id"),obj.attr("lay-type"));
  	});
  	//选择日期--待审核
  	$('#wait_sel1').val('2019-01-25');
  	laydate.render({
	    elem: '#wait_sel1'
  	});
  	//选择日期--审核不通过
  	$('#not_sel1').val('2019-01-25');
  	laydate.render({
	    elem: '#not_sel1'
  	});
  	//选择日期--审核通过
  	$('#yes_sel1').val('2019-01-25');
  	laydate.render({
	    elem: '#yes_sel1'
  	});
  	//待审核 审核通过与打回
  	$('#waitBtns .layui-btn').on('click', function(){
    	var othis = $(this), method = othis.data('method');
    	active[method] ? active[method].call(this, othis) : '';
  	});
  	$('#comInputs').children('.layui-unselect ').each(function(){
  		var title = $(this).find('span').text();
  		$(this).find('span').attr('title',title);
  	});
  	$('#modSear').on('click', function(){
    	var othis = $(this), method = othis.data('method');
    	active[method] ? active[method].call(this, othis) : '';
  	});
  	
  	//审核不通过---处方信息
  	table.on('tool(not_id)', function(obj){
  		notCf(table,$);//审核不通过处方单
	    var data = obj.data;
      	layer.open({
	        type: 1
	        ,title: ['处方单信息','font-size:14px;color:#323232;background-color:#F6F7FB;padding-left:15px']
	        ,offset: "auto"
	        ,id: 'layerDemoauto3'
	        ,skin: 'che-mod-dh'
	        ,area: ['60%', 'auto']
	        ,content: $('#notcfCont')
	        ,btn: false
	        ,shade: 0.3
	        ,shadeClose: true
	        ,closeBtn: 0
	        ,anim: 5//渐显
      	});
  	});
});
///////////////////////////////////////////////////待审核
//待审核处方列表---无分页 滚动
function waitTable(table,$){
	var tableurl1 = 'http://localhost:8927/winbpweb/p?action=kfsglServlet&beanaction=getKfs';
	var tableOptions1 = {
		height: 'full-155'
	    ,elem: '#wait_table'
	    ,url: 'data.json'
//	    ,method: 'POST'
//	    ,url: tableurl1
	    ,parseData: function(res){
	    	$('#waitlen').html(res.data.length);
//	    	return {
//	    		"code": 0,
//	    		"msg": "",
//	    		"count": res.length,
//	    		"data": res,
//	    	}
	    }
	    ,cellMinWidth: 100
	    ,cols: [[
			{field:'id', title: '开具日期', sort:true}
			,{title: '就诊信息', templet: function(val){
		   		return val.city + '</br>' + val.classify
		   	}}
			,{title: '患者信息', templet: function(val){
		   		return val.username + ' ' + val.sex + '</br>' + val.score
		   	}}
	    ]]
	    ,page: false
//	  	,done: function(res,curr,count){
//			var that = this.elem.next();
//			res.data.forEach(function (item, index) {
//	       	if (index%2==1) {
//	            	var tr = that.find(".layui-table-box tbody tr[data-index='" + index + "']").css("background-color", "#f5f5f5");
//	        	}
//	    	});
//	  	}
	};
    var wait1 = function () {
        table.init('wait_id', tableOptions1);
    };
    wait1();
}
//待审核处方单表格--无分页 滚动
function waitCf(table,$){
	var tableurl2 = 'http://localhost:8927/winbpweb/p?action=kfsglServlet&beanaction=getKfs';
	var tableOptions2 = {
		height: 'full-295'//高度最大化减去差值
	    ,elem: '#wait_table_cf'
	    ,url: 'data.json'
//	    ,method: 'POST'
//	    ,url: tableurl2
	    ,parseData: function(res){
//	    	return {
//	    		"code": 0,
//	    		"msg": "",
//	    		"count": res.length,
//	    		"data": res,
//	    	}
	    }
	    ,cellMinWidth: 100
	    ,cols: [[
			{title: '名称/规格', templet: function(val){
		   		return val.username + '</br>' + val.sex
		   	}}
			,{field:'city', title: '剂量'}
			,{field:'sign', title: '用法'}
			,{field:'wealth', title: '频次'}
			,{field:'score', title: '天数'}
			,{field:'logins', title: '数量', width: 70}
	    ]]
	    ,page: false
	    ,done: function(res,curr,count){
	  	}
	};
    var wait2 = function () {
        table.init('wait_id_cf', tableOptions2);
    };
    wait2();
}
//历史处方列表 ---无分页 滚动
function waitHis(table,$){
	var tableurl = 'http://localhost:8927/winbpweb/p?action=kfsglServlet&beanaction=getKfs';
	var tableOptions = {
		height: 'full-382'//高度最大化减去差值
	    ,elem: '#wait_table_his'
	    ,url: 'data.json'
//	    ,method: 'POST'
//	    ,url: tableurl
	    ,parseData: function(res){
//	    	return {
//	    		"code": 0,
//	    		"msg": "",
//	    		"count": res.length,
//	    		"data": res,
//	    	}
	    }
	    ,cellMinWidth: 100
	    ,cols: [[
			{title: '名称/规格',width:"50%", templet: function(val){
		   		return val.username + '' + val.city+ '' + val.sign+ '' + val.classify
		   	}}
			,{field:'city', title: '剂量'}
			,{field:'sign', title: '用法'}
			,{field:'wealth', title: '频次'}
			,{field:'score', title: '天数'}
			,{field:'logins', title: '数量'}
	    ]]
	    ,page: false
	    ,done: function(res,curr,count){
	  	}
	};
    var wait3 = function () {
        table.init('wait_id_his', tableOptions);
    };
    wait3();
}
///////////////////////////////////////////////////审核不通过
function notTable(table,$){
	var tableurl = 'https://www.layui.com/demo/table/user/?page=1&limit=30';
	var tableOptions = {
		height: 'full-170'
	    ,elem: '#not_table'
	    ,url: 'data1.json'
//	    ,method: 'POST'
//	    ,url: tableurl
	    ,parseData: function(res){
	    	$('#notlen').html(res.data.length);
	    }
	    ,cellMinWidth: 100
	    ,cols: [[
			{field:'id', title: '审核日期', sort:true, templet: function(val){
		   		return val.id + '</br>' + val.wealth
		   	}}
			,{field:'username', title: '审核药师'}
			,{title: '患者信息', templet: function(val){
		   		return val.username + ' ' + val.logins + '</br>' + val.sex
		   	}}
			,{title: '就诊信息', templet: function(val){
		   		return val.classify + '/' + val.username
		   	}}
			,{field:'id', title: '开具日期', sort:true, templet: function(val){
		   		return val.id + '</br>' + val.wealth
		   	}}
			,{title: '问题' ,minWidth: 400, templet: function(val){
		   		return val.city + '</br>' + val.wealth
		   	}}
			,{title: '详情', toolbar: '#notset'}
	    ]]
//	    ,page: true
		,page: {
			layout: ['count', 'prev', 'page', 'next'] //自定义分页布局
			,limit: 10
		}
	  	,done: function(res,curr,count){}
	};
    var wait = function () {
        table.init('not_id', tableOptions);
    };
    wait();
}
function notCf(table,$){
	var tableurl = 'http://localhost:8927/winbpweb/p?action=kfsglServlet&beanaction=getKfs';
	var tableOptions = {
		height: 'full-600'//高度最大化减去差值
	    ,elem: '#not_table_cf'
	    ,url: 'data.json'
//	    ,method: 'POST'
//	    ,url: tableurl
	    ,parseData: function(res){
	    }
	    ,cellMinWidth: 100
	    ,cols: [[
			{title: '名称/规格', templet: function(val){
		   		return val.username + '</br>' + val.sex
		   	}}
			,{field:'city', title: '剂量'}
			,{field:'sign', title: '用法'}
			,{field:'wealth', title: '频次'}
			,{field:'score', title: '天数'}
			,{field:'logins', title: '数量', width: 70}
	    ]]
	    ,page: false
	    ,done: function(res,curr,count){
	  	}
	};
    var wait = function () {
        table.init('not_id_cf', tableOptions);
    };
    wait();	
}
///////////////////////////////////////////////////审核通过
function yesTable(table,$){
	var tableurl = 'http://localhost:8927/winbpweb/p?action=kfsglServlet&beanaction=getKfs';
	var tableOptions = {
		height: 'full-155'
	    ,elem: '#yes_table'
	    ,url: 'data.json'
//	    ,method: 'POST'
//	    ,url: tableurl
	    ,parseData: function(res){
	    	$('#yeslen').html(res.data.length);
//	    	return {
//	    		"code": 0,
//	    		"msg": "",
//	    		"count": res.length,
//	    		"data": res,
//	    	}
	    }
	    ,cellMinWidth: 100
	    ,cols: [[
			{field:'id', title: '审核日期', sort:true, templet: function(val){
		   		return val.city + '</br>' + val.classify
		   	}}
			,{field:'username', title: '审核药师'}
			,{title: '就诊信息', templet: function(val){
		   		return val.username + '</br>' + val.score
		   	}}
			,{title: '患者信息', templet: function(val){
		   		return val.username + ' ' + val.sex + '</br>' + val.score
		   	}}
	    ]]
	    ,page: false
	  	,done: function(res,curr,count){}
	};
    var wait = function () {
        table.init('yes_id', tableOptions);
    };
    wait();
}
function yesCf(table,$){
	var tableurl = 'http://localhost:8927/winbpweb/p?action=kfsglServlet&beanaction=getKfs';
	var tableOptions = {
		height: 'full-295'//高度最大化减去差值
	    ,elem: '#yes_table_cf'
	    ,url: 'data.json'
//	    ,method: 'POST'
//	    ,url: tableurl
	    ,parseData: function(res){
//	    	return {
//	    		"code": 0,
//	    		"msg": "",
//	    		"count": res.length,
//	    		"data": res,
//	    	}
	    }
	    ,cellMinWidth: 100
	    ,cols: [[
			{title: '名称/规格', templet: function(val){
		   		return val.username + '</br>' + val.sex
		   	}}
			,{field:'city', title: '剂量'}
			,{field:'sign', title: '用法'}
			,{field:'wealth', title: '频次'}
			,{field:'score', title: '天数'}
			,{field:'logins', title: '数量', width: 70}
	    ]]
	    ,page: false
	    ,done: function(res,curr,count){
	  	}
	};
    var wait = function () {
        table.init('yes_id_cf', tableOptions);
    };
    wait();	
}
