$.ajax({
	type:"post",
	url:"/doctoru/index.php/site/pk",
	async:true,
	data:{},
	success:function(d){
		var	loginForm = {
			'username':'whmw',
			'password':"123456",
			'school_alias':'gxmu',
			'remember':0
		}
		
		$.ajax({
			type:"post",
			url:"/doctoru/index.php/site/login",
			async:true,
			data:loginForm,
			success:function(data){
				console.info(data);
			},
			error:function(err){
				console.info(err);
			}
		});
	},
	error:function(err){}
});