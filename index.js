const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port =5000
const cors = require('cors')

const bodyParser = require('body-parser');
const {User} = require('./models/User');
const config = require('./config/key');
const cookieParser = require('cookie-parser');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors())

mongoose.connect(config.mongoURI,{
    useNewUrlParser : true,useUnifiedTopology : true
}).then(()=>console.log("mongodb connected .."))
.catch(err => console.log(err))

app.post('/register',(req,res) =>{
    //회원가입할때 필요한 정보를 client에서 가져오면
    // 그것들을 데이터 베이스에 넣어줌 
    const user = new User(req.body)
    user.save((err,user) =>{
        if(err) return res.json({success:false,err})
        return res.status(200).json({
            success:true
        })
    })
})
app.post('/login',(req,res) =>{
    //요청된 이메일을 데이터베이스에서 있는지 찾는다.
    User.findOne({
        email:req.body.email},(err,user) => {
        console.log('user',user);
        if(!user) {
            return res.json({
                loginSuccess: false,
                message:"제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
//요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인.
        user.comparePassword(req.body.password,(err,isMatch)=>{
              // console.log('err',err)

      // console.log('isMatch',isMatch)

            if(!isMatch)
            return res.json({ loginSuccess:false, message:"비밀번호가 틀렸습니다"})
            
            //비밀번호까지 맞다면 토큰을 생성하기
            user.generateToken((err,user)=>{
                if(err) return res.status(400).send(err);
                //토큰을 쿠키나 로컬스토리지에 저장
                res.cookie("x_auth",user.token)
                .status(200)
                .json({loginSuccess:true , userId: user._id})
                
            })
        })
    })
    
    //비밀번호 까지 맞다면 토큰을 생성하기 
})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})