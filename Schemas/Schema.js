import express from "express"
import mongoose from "mongoose"

const shemaObj = new mongoose.Schema({
    title:{
        type:String,
        required:true
    }
    , desc:{
        type:String,
        required:true
    }

})

export const postModel = mongoose.model("ObjUser",shemaObj)



