ParserManager=function(){
    this._PARSERS=[];
    this.parse=function(base_url,in_json){
        var output=[];
        
        var obj=JSON.parse(in_json);
        var posts=obj.post_stream.posts;
        for(var i=0;i<posts.length;i++){
            var post=posts[i];
            
            var o_obj={};            
            o_obj.content=this._parseContent(post.cooked);
            if(o_obj.content.length===0)continue;
            output.push(o_obj);
            
            // Use author name as first choice
            o_obj.author=post.name;
            // If the author didn't set a name, use his username.
            if(o_obj.author.length===0)o_obj.author=post.username;
            
            o_obj.created_at=post.created_at;
            o_obj.updated_at=post.updated_at;
            o_obj.score=post.score;
            o_obj.url=base_url+""+post.topic_id+"/"+(i+1);
            o_obj.post_id=post.id;
            o_obj.likes=0;
            o_obj.message=post.cooked;
            // Get likes
            for(var j=0;j<post.actions_summary.length;j++){
                if(post.actions_summary[j].id===2){
                    o_obj.likes=post.actions_summary[j].count;
                    break;
                }
            }
            
        }  
     //   this._orderByScore(output);
        return output;
    }

    this._parseContent=function(content){ // Return array of media
        var out_array=[];
        for(var i=0;i<this._PARSERS.length;i++){
            this._PARSERS[i].parse(content,out_array);
        }
        return out_array;
    }
    this.addParser=function(parser){
        this._PARSERS.push(parser);
    }
}