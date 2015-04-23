var path = require('path');
var fs = require('fs');
var async = require('async');
var _ = require('underscore');

module.exports = function(app){
    var ObjectId = app.mongoose.Types.ObjectId;
     var route = app.njax.routes.accountsetting = {
        
            owner_query:function(req){
                if(!req.user){
                    return null;
                }
                return {
                    owner:req.user._id
                }
            },
        

        init:function(uri){

            if(!uri) uri = '/account_settings';
            app.locals.partials._accountSetting_edit_form = 'model/_accountSetting_edit_form';
            app.locals.partials._accountSetting_list_single = 'model/_accountSetting_list_single';
            app.param('accountsetting', route.populate)


            app.post(
                uri,
                [
					function(req, res, next){
						if(!req.njax){
							req.njax = {};
						}
						req.njax.action = 'create';
						req.njax.entity = 'accountSetting';
						return next();
					},
                    route.auth_create,
                    
                    route.validate,
                    route.pre_create,
                    route.create,
                    route.update,
                    route.pre_update_save,
                    route.update_save,
                    route.post_create,
                    route.bootstrap_detail,
                    route.broadcast_create,
                    route.redirect_detail
                ]
            );
            app.post(
                uri + '/new',
                [
                	function(req, res, next){
						if(!req.njax){
							req.njax = {};
						}
						req.njax.action = 'create';
						req.njax.entity = 'accountSetting';
						return next();
                	},
                    route.auth_create,
                    
                    route.validate,
                    route.pre_create,
                    route.create,
                    route.update,
                    route.pre_update_save,
                    route.update_save,
                    route.post_create,
                    route.bootstrap_detail,
                    route.broadcast_create,
                    route.redirect_detail
                ]
            );
            app.post(
                uri + '/:accountsetting',
                [
					function(req, res, next){
						if(!req.njax){
							req.njax = {};
						}
						req.njax.action = 'update';
						req.njax.entity = 'accountSetting';
						return next();
					},
                    route.auth_update,
                    
                    route.validate,
                    route.pre_update,
                    route.update,
                    route.pre_update_save,
                    route.update_save,
                    route.post_update,
                    route.bootstrap_detail,
                    route.broadcast_update,
                    route.render_detail
                ]
            );
            
                app.delete(
                    uri + '/:accountsetting',
                    [
						function(req, res, next){
							if(!req.njax){
								req.njax = {};
							}
							req.njax.action = 'remove';
							req.njax.entity = 'accountSetting';
							return next();
						},
                        route.auth_update,
                        route.pre_remove,
                        route.remove,
                        route.post_remove,
                        route.bootstrap_detail,
                        route.broadcast_remove,
                        route.render_remove
                    ]
                );
            

            app.all(uri, [
                route.auth_query_list,
				route.populate_tag_query,
                route.populate_list_query,
                route.populate_list,
                route.bootstrap_list,
                route.render_list
            ]);
            app.all(uri + '/new', [
            	route.auth_create,
                route.bootstrap_edit,
                route.render_edit
            ]);

            app.all(uri + '/:accountsetting', [
                route.auth_query_detail,
                route.bootstrap_detail,
                route.render_detail
            ]);
            app.all(uri + '/:accountsetting/edit', [
            	function(req, res, next){
					if(!req.accountSetting){
						return next(new Error(404));
					}
					return next();
            	},
                route.auth_update,
                route.bootstrap_edit,
                route.render_edit
            ]);
            
            	app.post(uri +  '/:accountsetting/tags',[
            		route.validate_tag,
					route.create_tag,
					route.broadcast_update,
					route.render_tag
				]);
				app.delete(uri +  '/:accountsetting/tags/:tag',[
					function(req, res, next){
						if(!req.tag){
							return next(new Error(404));
						}
						return next();
					},
					route.remove_tag,
					route.broadcast_update,
					route.render_tag
				]);
				app.all(uri +  '/:accountsetting/tags',[
                    route.auth_query_tags,
					route.list_tags,
					route.render_tags
				]);
				app.all(uri +  '/:accountsetting/tags/:tag',[
                    route.auth_update,
					function(req, res, next){
						if(!req.tag){
							return next(new Error(404));
						}
						return next();
					},
					route.render_tag
				]);




                app.post(uri +  '/:accountsetting/subscriptions',[
                    route.auth_create_subscription,
                    route.create_subscription,
                    route.render_subscription_detail
                ]);
                app.delete(uri +  '/:accountsetting/subscriptions/:subscription',[
                    function(req, res, next){
                        if(!req.subscription){
                            return next(new Error(404));
                        }
                        return next();
                    },
                    route.remove_subscription,
                    route.render_subscription_detail
                ]);
                app.all(uri +  '/:accountsetting/subscriptions',[
                    route.auth_query_subscription,
                    route.list_subscription,
                    route.render_subscription_list
                ]);
                app.all(uri +  '/:accountsetting/subscriptions/:subscription',[
                    route.auth_update,
                    function(req, res, next){
                        if(!req.tag){
                            return next(new Error(404));
                        }
                        return next();
                    },
                    route.render_subscription_detail
                ])



				/*
				//For now we will use the trigger event
				app.post(uri +  '/:accountsetting/events',[
					route.create_event,
					route.broadcast_event,
					route.render_tag
				]);
				//We dont need to remove events at this point
				app.delete(uri +  '/:accountsetting/events/:event',[
					function(req, res, next){
						if(!req.tag){
							return next(new Error(404));
						}
						return next();
					},
					route.remove_event,
					route.render_event
				]);
				*/

				app.all(uri +  '/:accountsetting/events',[
                    route.auth_query_detail,
					route.list_events,
					route.render_events
				]);
				app.all(uri +  '/:accountsetting/events/:event',[
					function(req, res, next){
						if(!req.tag){
							return next(new Error(404));
						}
						return next();
					},
					route.render_events
				]);


            


        },
        auth_query_detail:function(req, res, next){
            return next();
        },
        auth_query_list:function(req, res, next){
            return next();
        },
        auth_query_tags:function(req, res, next){
            return next();
        },
        auth_query_subscription:function(req, res, next){
            return next();
        },
        auth_create_subscription:function(req, res, next){
            return next();
        },
        auth_update:function(req, res, next){
            
            	
					if(req.user && (req.accountSetting && (req.accountSetting.owner && req.accountSetting.owner.equals(req.user._id)) || (req.is_admin))){
						return  next();//We have a legit users
					}
                
                return next(new Error(403));//We do not have a legit user
            
        },
        auth_create:function(req, res, next){
             //ENtities that have not been created do not have an owner to manage
             if(!req.user){
                 return next(new Error(404));//res.redirect('/');
             }
             return next();

        },
        populate:function(req, res, next, id){

            
                var or_condition = []

                if(app.njax.helpers.regex.isHexKey(id)){
                    or_condition.push({ _id:new ObjectId(id) });
                }
                
                if(or_condition.length == 0){
                    return next();
                }
                var query = {
                    $and:[
                        { $or: or_condition }

                    
                        ,
                        { $or: [
                            { archiveDate: { $gt: new Date() } },
                            { archiveDate: null }
                        ] }

                    
					
                     ]
                };


				
                app.model.AccountSetting.findOne(query, function(err, accountsetting){
                    if(err){
                        return next(err);
                    }
                    if(accountsetting){
                        res.bootstrap('accountSetting', accountsetting);
                    }
                    return next();
                });
            


        },
        render_remove:function(req, res, next){
            res.render('model/accountSetting_detail', res.locals.accountSetting);
        },
        render_list:function(req, res, next){
            res.render('model/accountSetting_list', res.locals.accountSettings);
        },
		populate_tag_query:function(req, res, next){

			if(!req.query.tags){
				return next();
			}
			if(!req._list_query){
				req._list_query = _.clone(route.read_query(req));
			}
			var tag_query = [];
			var tags = req.query.tags.split(',');
			for(var i in tags){
				tag_query.push({ value: tags[i] });
			}

			return app.njax.tags.query(
				{
					tag_query:tag_query,
					entity_type:"AccountSetting"
				},
				function(err, entites){
					if(err) return next(err);
					var entity_id_query = [];
					if(entites.length == 0){
						req._list_query = false;
						return next();
					}
					for(var i in entites){
						entity_id_query.push({ _id: entites[i].entity_id });
					}

					req._list_query.$or = entity_id_query;


					return next();
				}
			);

		},
        populate_list_query:function(req, res, next){
			if(!req._list_query){
				if(req._list_query === false){
					//Then they tried to tag search and it returned no results
					return next();
				}else{
					req._list_query = _.clone(route.read_query(req));
					if(!req._list_query){
						req._list_query = {}; //return next();//TODO: Fix this so its secure
					}

				}
			}



			
				req._list_query = {
					$and:[
						req._list_query,
						{ $or: [
							{ archiveDate: { $gt: new Date() } },
							{ archiveDate: null }
						] }
					]
				}
			
			



            
                
                    if(req.query.owner){
                        req._list_query['owner'] = req.query.owner;
                    }
                
            
                
                    if(req.query.setting_namespace){
                        var escpaedField = app.njax.helpers.regex.escape(req.query.setting_namespace);
						req._list_query['setting_namespace'] =  { $regex: new RegExp('.*' + escpaedField + '', 'i') };
                    }
                
            
                
                    if(req.query.type){
                        var escpaedField = app.njax.helpers.regex.escape(req.query.type);
						req._list_query['type'] =  { $regex: new RegExp('.*' + escpaedField + '', 'i') };
                    }
                
            
                
                
            



            return next();
        },
        populate_list:function(req, res, next){
            var query = req._list_query;
            if(!query){
                return next();
            }
            var accountSettings = null;
            async.series([
                function(cb){
                    




                        if(req.query.$orderby){
                            var orderby_parts = req.query.$orderby.split(':');
                            var orderby_data = {};
                            orderby_data['_query_field'] = (typeof(orderby_parts[1]) != 'undefined' && parseInt(orderby_parts[1])) || 1;
                            var agg_query = [
                                { $match:query },
                                {
                                    $project: {

                                        
                                            owner:'$owner',
                                        
                                            setting_namespace:'$setting_namespace',
                                        
                                            type:'$type',
                                        
                                            archiveDate:'$archiveDate',
                                        

                                        _query_field: { $toLower: '$' + orderby_parts[0] }

                                    }
                                },
                                {
                                    $sort: orderby_data
                                }
                            ];

                            return app.model.AccountSetting.aggregate(
                                agg_query
                            ).exec(function(err, _accountSettings_data){
                                if(err) return next(err);
                                res.bootstrap('accountSettings', _accountSettings_data);
                                return next();
                            });

                        }





                        app.model.AccountSetting.find(query, function(err, _accountSettings){
                            if(err) return next(err);
                            accountSettings = _accountSettings;
							res.bootstrap('accountSettings', accountSettings);
                            return cb();
                        });
                    
                },
                function(cb){
                    res.locals.accountSettings = [];
                    for(var i in accountSettings){
                        var accountSetting_data = accountSettings[i].toObject();
                        
                            if(req.user && (accountSettings[i].owner == req.user._id)){
                                accountSetting_data._user_is_owner = true;
                            }
                        
                        res.locals.accountSettings.push(
                            accountSetting_data
                        );
                    }

                    return cb();
                },
                function(cb){

                    return next();
                }
            ]);
        },
        render_detail:function(req, res, next){
            if(!req.accountSetting){
                return next();
            }

            
                if(req.user && req.accountSetting && req.accountSetting.owner == req.user._id){
                    res.locals._user_is_owner = true;
                }
            

            res.render('model/accountSetting_detail', req.accountSetting.toObject());
        },
        redirect_detail:function(req, res, next){
  			if(!req.accountSetting){
                return next();
            }
            if(req.njax.call_type == 'www'){
				return res.redirect(req.accountSetting.uri);
            }
            return route.render_detail(req, res, next);

        },
        redirect_edit:function(req, res, next){
  			if(!req.accountSetting){
                return next();
            }

            res.redirect(req.accountSetting.uri + '/edit');
        },
        render_edit:function(req, res, next){
            async.series([
                function(cb){
                    if(!req.accountsetting){
                        //return next();
                        req.accountsetting = new app.model.AccountSetting();
                    }
                    return cb();
                },
                
                
                
                function(cb){

                    res.render('model/accountSetting_edit');
                }
            ]);
        },
        create:function(req, res, next){

            if(!req.accountSetting){
                req.accountSetting = new app.model.AccountSetting({
                    
                            owner:(req.user && req.user._id || null),
                    
                    cre_date:new Date()
                });
                

            }
            return next();

        },
        update:function(req, res, next){

            if(!req.accountSetting){
                return next();
                //return next(new Error('AccountSetting not found'));
            }

            
                
                	
						if(!req.accountSetting.owner && req.user){
							req.accountSetting.owner = req.user._id;
						}
                	
                
            
                
					if(!_.isUndefined(req.body.setting_namespace)){
                    	req.accountSetting.setting_namespace = req.body.setting_namespace;
					}
                
            
                
					if(!_.isUndefined(req.body.type)){
                    	req.accountSetting.type = req.body.type;
					}
                
            
                
					if(!_.isUndefined(req.body.archiveDate)){
                    	req.accountSetting.archiveDate = req.body.archiveDate;
					}
                
            

            return next();

        },
        update_save:function(req, res, next){
            if(!req.accountSetting){
                return next();
            }
            req.accountSetting.save(function(err, accountSetting){
				if(err){
					return next(err);
				}
                //app._refresh_locals();
                res.bootstrap('accountSetting', req.accountSetting);
                return next();
            });
        },
        query:function(req, res, next){
            return next();
        },
        pre_update_save:function(req, res, next){
            return next();
        },
        bootstrap_list:function(req, res, next){
            return next();
        },
        bootstrap_detail:function(req, res, next){
            


				
					if(req.user && req.accountSetting && req.accountSetting.owner && (req.accountSetting.owner.equals(req.user._id))){
						res.bootstrap('is_owner', true);
					}else{
						res.bootstrap('is_owner', false);
					}
				
            
            return next();
        },
        bootstrap_edit:function(req, res, next){
            return next();
        },
        validate:function(req, res, next){
            return next();
        },
        pre_update:function(req, res, next){
            return next();
        },
        pre_create:function(req, res, next){
            return next();
        },
        pre_create_properties:function(req, res, next){
            return next();
        },
        pre_remove:function(req, res, next){
            return next();
        },
        post_update:function(req, res, next){
            return next();
        },
        post_create:function(req, res, next){
            return next();
        },
        post_remove:function(req, res, next){
			return next();
        },
		validate_tag:function(req, res, next){
			if(!req.body.type){
				return next(new Error("Ivalid type"));
			}
			return next();
		},
		create_tag:function(req, res, next){
			if(!req.accountSetting){
				return next(new Error(404));
			}
			//TODO: Add validation
			return app.njax.tags.add(
				req.body,
				req.accountSetting,
				function(err, tag){
					if(err) return next(err);
					res.bootstrap('tag', tag);
					return next();
				}
			);
		},
		remove_tag:function(req, res, next){
			if(!req.tag){
				return next(new Error(404));
			}
			return req.tag.remove(function(err){
				if(err) return next(err);
				return next();
			});
		},
		list_tags:function(req, res, next){
			app.njax.tags.query(req.accountSetting, function(err, tags){
				if(err) return next(err);
				res.bootstrap('tags', tags);
				return next();
			});
		},
		render_tags:function(req, res, next){
			return res.render('model/tags_list', res.locals.tags);
		},
		render_tag:function(req, res, next){
			return res.render('model/tag_detail', res.locals.tag);
		},





        create_subscription:function(req, res, next){
            if(!req.accountSetting){
                return next(new Error(404));
            }
            //TODO: Add validation
            return app.njax.subscription.add(
                req.user,
                req.accountSetting,
                req.body,
                function(err, subscription){
                    if(err) return next(err);
                    res.bootstrap('subscription', subscription);
                    return next();
                }
            );
        },
        remove_subscription:function(req, res, next){
            if(!req.tag){
                return next(new Error(404));
            }
            return req.subscription.remove(function(err){
                if(err) return next(err);
                return next();
            });
        },
        list_subscription:function(req, res, next){
            app.njax.subscription.query(req.accountSetting, function(err, subscriptions){
                if(err) return next(err);
                res.bootstrap('subscriptions', subscriptions);
                return next();
            });
        },
        render_subscription_list:function(req, res, next){
            return res.render('model/subscriptions_list', res.locals.subscriptions);
        },
        render_subscription_detail:function(req, res, next){
            return res.render('model/subscription_detail', res.locals.subscription);
        },




		/*
		create_event:function(req, res, next){
			if(!req.accountSetting){
				return next(new Error(404));
			}
			//TODO: Add validation
			return app.njax.tags.add(
				req.body,
				req.accountSetting,
				function(err, tag){
					if(err) return next(err);
					res.bootstrap('event', event);
					return next();
				}
			);
		},
		remove_event:function(req, res, next){
			if(!req.event){
				return next(new Error(404));
			}
			return req.event.remove(function(err){
				if(err) return next(err);
				return next();
			});
		},
		*/
		list_events:function(req, res, next){
            if(!req.accountSetting){
                return next(new Error(404));
            }
			app.njax.events.query(req.accountSetting, function(err, events){
				if(err) return next(err);
				res.bootstrap('events', events);
				return next();
			});
		},
		render_events:function(req, res, next){
			return res.render('model/event_list', res.locals.events);
		},
		render_event:function(req, res, next){
			return res.render('model/event_detail', res.locals.event);
		},

        broadcast_create:function(req, res, next){
            
                app.njax.broadcast(
                    [ req.user ],
                    'accountSetting.create',
                    {
                        user:req.user.toObject(),
                        accountSetting: req.accountSetting.toObject(),
						_url:req.accountSetting.url,
						_entity_type:req.accountSetting._njax_type
                    }
                );
                return next();
            
        },
        broadcast_update:function(req, res, next){
            

                    app.njax.broadcast(
                        [ req.user ],
                        'accountSetting.update',
                        {
                            user:req.user.toObject(),
                            accountSetting: req.accountSetting.toObject(),
							_url:req.accountSetting.url,
							_entity_type:req.accountSetting._njax_type
                        }
                    );

                return next();
            
        },
        broadcast_remove:function(req, res, next){
            

                app.njax.broadcast(
                    [ req.user ],
                    'accountSetting.remove',
                    {
                        user:req.user.toObject(),
                        accountSetting: req.accountSetting.toObject(),
						_url:req.accountSetting.url,
						_entity_type:req.accountSetting._njax_type
                    }
                );
                return next();
            
        },
        
            remove:function(req, res,next){
                if(!req.user){
                    return next();
                }
                req.accountSetting.archive(function(err){
                    if(err) return next(err);
                    return next();
                });
            }
        
    }

    route.read_query = route.owner_query;
    route.write_query = route.owner_query;

    return route;

}
