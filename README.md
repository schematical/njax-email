NjaxEmailbase
=============

This is the node module that can be extended to create your email service

###Register Partial:
You can register .hjs for use as a partial in the email templates

```
app.njax.email.registerPartial('_footer', app.njax.config.app_dir + '/public/templates/partials/_footer.hjs');
```

###Register Templates:

You can register your hjs templates that will render with the NJax event data that is passed in as follows:
```
	app.njax.email.registerEmail(
		'100innovation.auth.forgot.pass',
		{
			subject:"Your Password For Your NJax Account",
			html_template:path.join(app.njax.config.tpl_dir', 'auth', 'forgot.pass.hjs')
		}
	);

```




####Config Variables:

#####subject:
This can ether be a string or a function that take function as follows:

```
	subject:function(event, data){
        return "A new project has been created: " + data.project.name;
    },

```

#####html_template:
This is the path to the .hjs html template:

```
html_template:path.join(app.njax.config.tpl_dir', 'auth', 'forgot.pass.hjs')
```


#####populate_users:
This is the path to the .hjs html template:

```
 function(accounts, event, data, cb){
        //Load all Profiles from that Location
        return app.sdk.Account.find({ /* ...your query ... */ }, function(err, accounts){
            if(err) return cb(err);
            return cb(null, accounts);
        });
    }
```




##Email Settings:

You can create settings that your users can switch on and off that will filter out various email using the following code

```
    app.njax.email.createSetting('basic', {
		name:'Basic Info Emails',
		desc:'Emails about basic stuff',
		filter:function(event, data, cb){
			var matches_namespace =  _.include([
				'core-app.basic.stuff',
			], event);
			return cb(null, matches_namespace);
		}
	});

	```


##Inbound:
NOTE: This is not quite ready yet


###Setting up a route:
The following code `'projects.*'` will take any email that comes in with a user of 'projects.my_project_namespace' and look up the actual **Project** entity from the core module.

```
app.njax.email.registerPostmarkInbound(
		'projects.*',
		function(email_address, email_data, next){
			var address_parts = email_address.match(/(projects)\.(\S+)@(\S+\.\S+)/);

			var project_namespace = address_parts[3];
			//Load this project
			return app.sdk.Project.find({ namespace: project_namespace }, function(err, project){
				if(err) return next(err);
				console.log(project);
				return next();
			})
			//This should be a project comment


		}
	);
```
