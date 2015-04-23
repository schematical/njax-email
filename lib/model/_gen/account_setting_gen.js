'use strict';
var fs = require('fs');
var async = require('async');
var mkdirp = require('mkdirp');
var _ = require('underscore');

module.exports = function(app){

    var Schema = app.mongoose.Schema;

    var fields = {
        _id: { type: Schema.Types.ObjectId },
    
        
            owner:{ type: Schema.Types.ObjectId, ref: 'Account' },
        
    
        
            setting_namespace:{ type:String },
        
    
        
            type:{"type":"String"},
        
    
        
            archiveDate:{"type":"Date","format":"date-time"},
        
    
		
        creDate:Date
    };

    var account_settingSchema = new Schema(fields);
	account_settingSchema.virtual('_njax_type').get(function(){
		return 'Account_setting';
	});
    account_settingSchema.virtual('uri').get(function(){
        
            
                return '/account_settings/' + this._id;
            
        
    });

    
        

    
        

    
        
			 account_settingSchema.virtual('type_tpcds').get(function(){
				return {
					
						allow:'Allow',
					
						block:'Block',
					
				}
			});

				account_settingSchema.path('type').validate(function (value) {
                    if(
                    
                        (value == 'allow') ||
                    
                        (value == 'block') ||
                    
                        (!value)
                    ){
                        return true;
                    }
                    return false;
  					//return /allow|block/.test(value);
				}, 'Invalid type');

        
            account_settingSchema.virtual('is_allow').get(function(){
                return (this.type == 'allow');
            });
        
            account_settingSchema.virtual('is_block').get(function(){
                return (this.type == 'block');
            });
        

                            

    
        

    

    
        account_settingSchema.virtual('archive').get(function(){
            return function(callback){
            	this.status = 'archived';
                this.archiveDate = new Date();
                this.save(callback);
            }
        });
        account_settingSchema.virtual('is_archived').get(function(){
			if(!this.archiveDate){
				return false;
			}
			if(!this.archiveDate > new Date()){
				return false;
			}
		   return true;
        });
    



    account_settingSchema.pre('save', function(next){
        if(!this._id){
            this._id = new app.mongoose.Types.ObjectId();
            this.creDate = new Date();
        }
        

        return next();

    });

 	account_settingSchema.virtual('events').get(function(){
		return function(callback){
			return app.njax.events.query(this, callback);
		}
	});


     account_settingSchema.virtual('tags').get(function(){
		return function(callback){
			return app.njax.tags.query(this, callback);
		}
	});
	account_settingSchema.virtual('addTag').get(function(){
		return function(tag_data, callback){
			return app.njax.tags.add(tag_data, this, callback);
		}
	});



    account_settingSchema.virtual('url').get(function(){
     	var port_str = '';
        if(!app.njax.config.hide_port){
            port_str = ':' + app.njax.config.port;
		}
		return app.njax.config.domain + port_str + this.uri;
	});

   account_settingSchema.virtual('api_url').get(function(){
    	var port_str = '';
        if(!app.njax.config.hide_port){
            port_str = ':' + app.njax.config.port;
		}
		
            return app.njax.config.api.host  + this.uri;
        
	});


    if (!account_settingSchema.options.toObject) account_settingSchema.options.toObject = {};
    account_settingSchema.options.toObject.transform = function (doc, ret, options) {
        ret.uri = doc.uri;

        ret.url = doc.url;
        ret.api_url = doc.api_url;
		ret._njax_type = doc._njax_type;

        
            

            
        
            

            
        
            
                
                    ret.is_allow = doc.is_allow;
                
                    ret.is_block = doc.is_block;
                

			
        
            
				ret.archiveDate = doc.archiveDate;
				if(doc.archiveDate){
					ret.archiveDate_iso = doc.archiveDate.toISOString();
				}
            
        

		ret.creDate = doc.creDate;
		if(doc.creDate){
			ret.creDate_iso = doc.creDate.toISOString();
		}
    }

    return account_settingSchema;
}
