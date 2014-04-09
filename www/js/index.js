/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        console.log("in initialize()");
        // alert("in initialize()");
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        console.log("in bindEvents()");
        // this.onDeviceReady();
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    
    onDeviceReady: function() {
        console.log("in deviceready()");
        $('.hot').on('tap', app.loadHotStories);   
        $('.upcoming').on('tap', app.upcomingStories); 
        $('.new').on('tap', app.newStoryForm); 
        app.loadHotStories();
    },

    loadHotStories: function(event){
        if(event){
            event.preventDefault();
        }
        $("#main").empty();
        $('.hot').addClass("ui-btn-active");
        $('.upcoming').removeClass("ui-btn-active");
        $('#main').html(app.template("story-listing"));
        $.mobile.loading( 'show',{});
        $.ajax({
                url: 'http://www.hackerpins.com/api/v1/stories',
                dataType: 'json',
                success: function(data) {
                    $.mobile.loading( 'hide',{});
                    $.each(data, function(i, story){
                        var storyTemplate = $("#story-template").html();
                        $("#stories").append(Mustache.to_html(storyTemplate,story));
                    });
                    $("#stories").listview().listview("refresh");
                    
                },
                error : function(XMLHttpRequest,textStatus, errorThrown) {   
                    $.mobile.loading( 'hide',{});  
                    alert("Something wrong happended on the server. Try again..");  
                }
            });
    },

    upcomingStories : function(event){
        if(event){
            event.preventDefault();
        }
        $("#main").empty();
        $('.hot').removeClass("ui-btn-active");
        $('.upcoming').addClass("ui-btn-active");
        $('#main').html(app.template("story-listing"));
        $.mobile.loading( 'show',{});
        $.ajax({
                url: 'http://www.hackerpins.com/api/v1/stories/upcoming',
                dataType: 'json',
                success: function(data) {
                    $.mobile.loading( 'hide',{});
                    $.each(data, function(i, story){
                        var storyTemplate = $("#story-template").html();
                        $("#stories").append(Mustache.to_html(storyTemplate,story));
                    });
                    $("#stories").listview().listview("refresh");
                    
                },
                error : function(XMLHttpRequest,textStatus, errorThrown) {   
                    $.mobile.loading( 'hide',{});  
                    alert("Something wrong happended on the server. Try again..");  
                }
            });
    },

    newStoryForm : function(event){
        event.preventDefault();
        $('#main').empty();
        $('#main').html(app.template("new-story"));
        $('#main').trigger('create');
        $('#create-button').bind('tap',app.newStory);
    },

    newStory : function(event){
        event.preventDefault();
        var url = $('#newStoryForm').find("input[name='url']").val();
        var title = $('#newStoryForm').find("input[name='title']").val();
        var description = $('textarea#description').val();
        var data = {
            url : url,
            title : title,
            description : description
        }
        $.ajax({
            url :'http://www.hackerpins.com/api/v1/stories',
            type : 'POST',
            contentType:"application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(data),
            success: function(data){
                $('#newStoryForm')[0].reset();
                app.showNotification('Received your feedback', 'Info');
                app.upcomingStories();

            }
        });
    },

    template : function(name) {
        return Mustache.compile($('#'+name+'-template').html());
    },

    showNotification : function(message, title){
    if (navigator.notification) {
        navigator.notification.alert(message, null, title, 'OK');
        } else {
            alert(title ? (title + ": " + message) : message);
        }

    }
    
};
