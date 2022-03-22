import React, {useEffect} from 'react';
import BN from 'bignumber.js'

import { Navbar, Nav, Container, Row, Col, Modal, InputGroup, FormControl } from 'react-bootstrap';
import { useState} from 'react';
import BigNumber from 'bignumber.js';
import axios from 'axios'
import * as API from './store/api';

import AOS from 'aos';
import 'aos/dist/aos.css';

const App = () => {
  useEffect(() => {
    AOS.init({
      duration : 1000,
      offset: 10
    })
    getTotalDividendsDistributed();
    fetchCurrencyData();
  });
	
  const [visibleDashboard, setVisibleDashboard] = useState(false);
  const [validAddress, setValidAddress] = useState(true);
  const [balance, setBalance] = useState('0');
  const [ethPrice, setEthPrice] = useState(0);
  const [totalDividendsDistributed, setTotalDividendsDistributed] = useState('0');
  const [totalDividendsDistributedUSD, setTotalDividendsDistributedUSD] = useState('0');
  const [userDividendsDistributed, setUserDividendsDistributed] = useState('0');
  const [userDividendsDistributedUSD, setUserDividendsDistributedUSD] = useState('0');
  const [userDividendsDistributedAt, setUserDividendsDistributedAt] = useState('Never');
		
  useEffect(()=> {
    setUserDividendsDistributedUSD(BN(parseFloat(userDividendsDistributed)).times(ethPrice).decimalPlaces(2).toString())
    setTotalDividendsDistributedUSD(BN(parseFloat(totalDividendsDistributed)).times(ethPrice).decimalPlaces(2).toString())
  }, [userDividendsDistributed, totalDividendsDistributed, ethPrice])

  
  const openDashboard = () => {
    setBalance(0);
    setUserDividendsDistributed(0);
    setUserDividendsDistributedAt('Never');
    setVisibleDashboard(true);
  }

  const fetchCurrencyData = () => {
    axios
    .get('https://api.coingecko.com/api/v3/simple/price?ids=weth&vs_currencies=usd')
    .then(response => {
      setEthPrice(response.data.weth.usd)
    })
    .catch(err => console.log(err))
  }

  const closeDashboard = () => {
    setVisibleDashboard(false);
  }

  const handleChangeAddress = (e) => {
    let address = e.target.value;

    if (API.isAddress(address)) {
      setValidAddress(true);
      getBalance(address);            
      getUserDividendsDistributed(address);
    }
    else {
      setValidAddress(false);
    }
  }

  const getBalance = async (address) => {
    let result = await API.balanceOf(address);
    let tokenBalance = BigNumber(API.WeiToEth(result));
    setBalance(tokenBalance.decimalPlaces(3).toString());
  }

  const getTotalDividendsDistributed = async () => {
    let result = await API.getTotalDividendsDistributed();
    let tokenBalance = BigNumber(API.WeiToEth(result));
    setTotalDividendsDistributed(tokenBalance.decimalPlaces(3).toString());
  }

  const getUserDividendsDistributed = async (address) => {
    let result = await API.getUserDividendsDistributed(address);
    let totalShare = BigNumber(API.WeiToEth(result[0].split(" ")[2]));
    let totalEth = BigNumber(API.WeiToEth(result[1].split(" ")[2]));
    let userShare = BigNumber(API.WeiToEth(result[2].split(" ")[2]));
    let tokenBalance = totalEth.times(userShare).div(totalShare);
    setUserDividendsDistributed(tokenBalance.decimalPlaces(5).toString());

    const lastBlock = await API.getLatestBlockNumber();
    
    axios
    .get(`https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=0x1684c51c40bc9c48f0a391258d6c8898841025cf&address=${address}&page=1&offset=100&startblock=0&endblock=${lastBlock}&sort=asc&apikey=P7WXT8SZ3JF5CBT9KX7KQSTGGPDE1BJ1W1`)
    .then(response => {
      if (response?.data?.result?.length) {
          let timestamp = response?.data?.result[0].timeStamp;
          var date = new Date(timestamp * 1000).toLocaleDateString("en-US");
          var time = new Date(timestamp * 1000).toLocaleTimeString("en-US");
          // Will display time in 10:30:23 format
          var formattedTime = date + ' ' + time;
          setUserDividendsDistributedAt(formattedTime);
      }
      else {
          setUserDividendsDistributedAt('Never');    
      }
      // setEthPrice(response.data.weth.usd)
    })
    .catch(err => console.log(err))
  }

		return (
				<>
          <div className="theme-parent">
            <div className='cloud-animation'>
            <Navbar expand="lg" className="custom-navbar">
              <Container className="align-items-start">
                <Navbar.Brand href="">
                  <img src={process.env.PUBLIC_URL + '/images/slogo.png'} />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                
                <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="mx-auto custom-navbar-nav mt-4">
                    <Nav.Link href="#about"> About </Nav.Link>
                    <Nav.Link href='#tokenomics'> Tokenomics </Nav.Link>
                    <Nav.Link href='#roadmap'> Roadmap </Nav.Link>
                    <Nav.Link href='#socials'> Socials </Nav.Link>
                    <Nav.Link href='https://shartaninu.gitbook.io/whitepaper/' target='_blank'>Whitepaper</Nav.Link>
                    <Nav.Link href="#dashboard" onClick={() => { openDashboard(); }}> Dashboard </Nav.Link>
                  </Nav>
                </Navbar.Collapse>
              </Container>
            </Navbar>
            <div className="hero-section" >
              <Container>
                <Row>
                  <Col lg={6} md={6} sm={12} className="d-flex align-items-center hero1">
                    <div className="hero-left">
                      <h1 className="text-uppercase title">SHARTAN INU</h1>
                      <p className="description">Born from the community for the community! <br/>KARMA is a Doge, Ruggers get REKT!</p>
                    </div>
                  </Col>
                  <Col lg={6} md={6} sm={12} className='hero2'>
                    <div className="hero-right">
                      <img src={process.env.PUBLIC_URL + '/images/character.png'} />
                    </div>
                  </Col>
                </Row>
              </Container>
            </div>
            <div className="cta-section d-none">
              <Container>
                <Row>
                  <Col lg={12} md={12} sm={12} className="d-flex align-items-center flex-column justify-content-center">
                    <h3>Presale LIVE Soon!</h3>
                    <a href="#" className="btn btn-primary">
                      Join Presale
                    </a>
                  </Col>
                </Row>
              </Container>
            </div>
            <div className="shield-section">
              <Container>
                <Row>
                  <Col lg={12} md={12} sm={12} className="d-flex align-items-center justify-content-center shield-area">
                    <a className="me-5" href='https://www.dextools.io/app/ether/pair-explorer/0x985a6fb3c71fe7699c0b57c85ec65c30f65857db' target='_blank'><img src={process.env.PUBLIC_URL + '/images/shield-1.png'} className="mr-lg-5 mr-md-5 mr-4" /></a>
                    <a className="me-5" href='https://etherscan.io/tx/0x17b97d967f827c41e0417a6ad94bcd240884501d9608922573712ed2ea01dfd6' target='_blank'><img src={process.env.PUBLIC_URL + '/images/shield-2.png'} className="mr-lg-5 mr-md-5 mr-4" /></a>
                    <a href='https://app.uniswap.org/#/swap?inputCurrency=0x5d2bc37e8d786d8115dfb53b1919609d63f5f45e' target='_blank'><img src={process.env.PUBLIC_URL + '/images/shield-3.png'} className="" /></a>
                  </Col>
                </Row>
              </Container>
            </div>
            <div className="content-section" id="about">
              <Container>
                <Row>
                  <Col lg={12} md={12} sm={12} className="d-flex align-items-center flex-column justify-content-center">
                    <h3 className='title text-uppercase'>THIS IS SHARTA!</h3>
                    <p className='text-center mb-lg-5 mb-3'>“In the bloodstained era of Crypto where raids and rugs happen everyday,
                      holders dump on each other in a race to madness while the devs feast on the innocent..."</p>
                    <p className='text-center'>
                      Shartan Inu is here to bring back order and calm to the crypto space. Using unique tokenomics, raids, and stealth to drive fear in the heart of bloodthirsty devs!
                    </p>
                  </Col>
                </Row>
              </Container>
            </div>
            <div className='token-section' id="tokenomics">
              <Container>
                <Row>
                  <Col lg={12} md={12} sm={12} className="d-flex flex-column justify-content-center" >	
                    <h3 className='title text-center text-uppercase'>STEALTH TOKENOMICS</h3>
                    <h5 className='text-center'><span className='b-line'></span>Total supply 10,000,000,000<span className='a-line'></span></h5>
                    <div className='text-center mx-auto my-3' id="whitepaper">
                      <div className='text-center box'>Tax 14% on buy/sell</div>
                      <div className='text-center box'>3% ETH rewards to holder</div>
                      <div className='text-center box'>6% Marketing/Team, 5% Raid Wallet</div>
                    </div>
                    <div className='bottom-desc' id="roadmap">
                      <h3 className='text-uppercase text-white'>Roadmap</h3>
                      <h5 className='text-white'>Phase 01</h5>
                      <ul>
                        <li><img src={process.env.PUBLIC_URL + '/images/sword.png'}/>Launch coin on ETH network</li>
                        <li><img src={process.env.PUBLIC_URL + '/images/sword.png'}/>Whitepaper release</li>
                        <li><img src={process.env.PUBLIC_URL + '/images/sword.png'}/>Website launch</li>
                        <li><img src={process.env.PUBLIC_URL + '/images/sword.png'}/>Team doxxed</li>
                        <li><img src={process.env.PUBLIC_URL + '/images/sword.png'}/>Weekly Shartan battle training VC</li>
                      </ul>
                      <h5 className='text-white'>Phase 02</h5>
                      <ul>
                        <li><img src={process.env.PUBLIC_URL + '/images/sword.png'}/>Cross network staking and rewards</li>
                        <li><img src={process.env.PUBLIC_URL + '/images/sword.png'}/>Anti Rug proof tool (beta)</li>
                        <li><img src={process.env.PUBLIC_URL + '/images/sword.png'}/>Real world rewards to holders</li>
                        <li><img src={process.env.PUBLIC_URL + '/images/sword.png'}/>And more...</li>
                      </ul>
                    </div>
                  </Col>
                </Row>
              </Container>
            </div>
            <div className='footer-section' id="socials">
              <div className='container d-flex align-items-center justify-content-between'>
                <p className='mb-0'>© 2022 All Rights Reserved. Powered by SHARTANS</p>
                <ul>
                  <li className='me-3'>
                    <a href='https://twitter.com/ShartanInu' target='_blank'><img src={process.env.PUBLIC_URL + '/images/icon-1.png'} /></a>
                  </li>
                  <li>
                    <a href='https://t.me/shartanentryportal' target='_blank'><img src={process.env.PUBLIC_URL + '/images/icon-2.png'} /></a>
                  </li>
                  {/*<li className='me-3'>
                      <a href='https://www.facebook.com/profile.php?id=100078099682932' target='_blank'><img src={process.env.PUBLIC_URL + '/images/fb-icon.png'} /></a>
                  </li>
                  <li>
                      <a href='https://www.instagram.com/shartaninu/' target='_blank'><img src={process.env.PUBLIC_URL + '/images/insta-icon.png'} /></a>
                  </li>*/}
                </ul>
              </div>
            </div>
          </div>
				</div>
				<Modal size="lg" show={visibleDashboard} onHide={closeDashboard} centered className="dashboard-modal">
          <Modal.Body className="dashboard-modal-body">
            <InputGroup size="lg" className="address-input-group mb-4 rounded-pill">
              <InputGroup.Text id="address-label">
                <svg id="link" xmlns="http://www.w3.org/2000/svg" width="25.307" height="25.306" viewBox="0 0 25.307 25.306">
                  <g id="ARC_176_" transform="translate(6.848 8.181)">
                    <g id="Group_2" data-name="Group 2">
                      <path id="Path_2" data-name="Path 2" d="M27.977,26.212a.971.971,0,0,1-.69-.286,3.907,3.907,0,0,0-5.52,0,.976.976,0,1,1-1.38-1.38,5.86,5.86,0,0,1,8.279,0,.976.976,0,0,1-.69,1.666Z" transform="translate(-20.101 -22.834)" fill="#4e0000"/>
                    </g>
                  </g>
                  <g id="ARC_175_" transform="translate(9.608 13.748)">
                    <g id="Group_3" data-name="Group 3">
                      <path id="Path_3" data-name="Path 3" d="M30.184,37.622a5.836,5.836,0,0,1-4.14-1.712.976.976,0,1,1,1.38-1.38,3.907,3.907,0,0,0,5.52,0,.976.976,0,1,1,1.38,1.38,5.838,5.838,0,0,1-4.14,1.712Z" transform="translate(-25.758 -34.244)" fill="#4e0000"/>
                    </g>
                  </g>
                  <g id="LINE_273_" transform="translate(16.507 8.297)">
                    <g id="Group_4" data-name="Group 4" transform="translate(0)">
                      <path id="Path_4" data-name="Path 4" d="M40.875,30.473a.976.976,0,0,1-.69-1.666l5.451-5.451a.976.976,0,1,1,1.38,1.38l-5.451,5.451A.971.971,0,0,1,40.875,30.473Z" transform="translate(-39.899 -23.071)" fill="#4e0000"/>
                    </g>
                  </g>
                  <g id="LINE_272_" transform="translate(8.297 18.911)">
                    <g id="Group_5" data-name="Group 5">
                      <path id="Path_5" data-name="Path 5" d="M24.047,49.824a.976.976,0,0,1-.69-1.666L26.4,45.112a.976.976,0,1,1,1.38,1.38l-3.047,3.047a.971.971,0,0,1-.69.286Z" transform="translate(-23.071 -44.826)" fill="#4e0000"/>
                    </g>
                  </g>
                  <g id="LINE_271_" transform="translate(1.397 9.608)">
                    <g id="Group_6" data-name="Group 6" transform="translate(0)">
                      <path id="Path_6" data-name="Path 6" d="M9.9,33.16a.976.976,0,0,1-.69-1.666l5.451-5.45a.976.976,0,1,1,1.38,1.38l-5.451,5.45a.975.975,0,0,1-.69.286Z" transform="translate(-8.929 -25.758)" fill="#4e0000"/>
                    </g>
                  </g>
                  <g id="LINE_270_" transform="translate(12.011 1.397)">
                    <g id="Group_7" data-name="Group 7" transform="translate(0 0)">
                      <path id="Path_7" data-name="Path 7" d="M31.66,13.928a.976.976,0,0,1-.69-1.666l3.047-3.047A.976.976,0,0,1,35.4,10.6L32.35,13.643A.977.977,0,0,1,31.66,13.928Z" transform="translate(-30.684 -8.929)" fill="#4e0000"/>
                    </g>
                  </g>
                  <g id="ARC_174_" transform="translate(0 15.058)">
                    <g id="Group_8" data-name="Group 8">
                      <path id="Path_8" data-name="Path 8" d="M11.888,47.177a5.837,5.837,0,0,1-4.14-1.683,5.933,5.933,0,0,1,0-8.28.976.976,0,1,1,1.38,1.38,3.9,3.9,0,1,0,5.52,5.52.976.976,0,0,1,1.38,1.38A5.836,5.836,0,0,1,11.888,47.177Z" transform="translate(-6.065 -36.928)" fill="#4e0000"/>
                    </g>
                  </g>
                  <g id="ARC_173_" transform="translate(15.058)">
                    <g id="Group_9" data-name="Group 9">
                      <path id="Path_9" data-name="Path 9" d="M44.8,16.313a.976.976,0,0,1-.69-1.666,3.9,3.9,0,0,0-5.52-5.52.976.976,0,1,1-1.38-1.38,5.855,5.855,0,0,1,8.28,8.28A.975.975,0,0,1,44.8,16.313Z" transform="translate(-36.929 -6.065)" fill="#4e0000"/>
                    </g>
                  </g>
                </svg>
              </InputGroup.Text>
                <FormControl
                  placeholder="Paste Your Address Here"
                  aria-label="address"
                  aria-describedby="address-label"
                  onChange={(e)=>handleChangeAddress(e)}
                />                        
            </InputGroup>        
            <div className={`alert alert-danger validate-address ${validAddress?'invisible':''}`}>Please input valid address.</div>            
            <h5 className="text-center mb-4">SHARTAN Dashboard</h5>
            <Row>
              <Col sm="4">
                  <div className="dashboard-info-section text-center">
                      <div className="dashboard-info-image mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" width="82.833" height="73.715" viewBox="0 0 82.833 73.715">
                              <g id="your_holdings" data-name="your holdings" transform="translate(0)">
                                  <g id="dollar" transform="translate(49.123 0)">
                                      <path id="Path_14" data-name="Path 14" d="M16.855,0A16.855,16.855,0,1,0,33.71,16.855,16.9,16.9,0,0,0,16.855,0Zm0,15.169a5.972,5.972,0,0,1,5.9,5.9,5.812,5.812,0,0,1-4.214,5.562v2.023H15.169V26.631a5.972,5.972,0,0,1-4.214-5.562h3.371a2.528,2.528,0,0,0,5.056,0,2.592,2.592,0,0,0-2.528-2.528,5.972,5.972,0,0,1-5.9-5.9,5.812,5.812,0,0,1,4.214-5.562V5.056H18.54V7.079a5.972,5.972,0,0,1,4.214,5.562H19.383a2.528,2.528,0,1,0-5.056,0A2.592,2.592,0,0,0,16.855,15.169Z" fill="#4e0000"/>
                                  </g>
                                  <path id="Path_15" data-name="Path 15" d="M82.186,211.271c-4.9.3-11.337,5.2-17.548,8.008-7.613,3.443-19.464.671-19.466.671,1.827-.853,9.257-2.623,10.754-3.284,7.953-3.5,7.278-10.791,3.49-10.73-5,.08-7.941,1.313-17.927,2.674-7.569,1.03-16.52.653-20.813,2.293C14.614,213.218,4.853,228.79,4.853,228.79l15.095,14.627s9.343-9.2,13.89-9.2c10.359,0,10.778-.139,20.4-.658,4.091-.223,4.945-.387,7.286-1.18,12.469-4.216,25.857-15.442,26.1-16.791C88.194,212.458,84.772,211.11,82.186,211.271Z" transform="translate(-4.853 -169.702)" fill="#4e0000"/>
                              </g>
                          </svg>
                      </div>
                      <div className="dashboard-info-text">
                          <h6>Your Holdings</h6>
                          <p>{balance} SHARTAN</p>
                      </div>
                  </div>
              </Col>
              <Col sm="4">
                <div className="dashboard-info-section text-center">
                  <div className="dashboard-info-image mb-4">
                    <svg id="totalETH" xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
                      <g id="Group_22" data-name="Group 22" transform="translate(31.572 21.606)">
                        <g id="Group_21" data-name="Group 21">
                          <path id="Path_21" data-name="Path 21" d="M203.4,133.44a8.411,8.411,0,0,0-8.411,8.411v3.765l16.822-.035v-3.731A8.411,8.411,0,0,0,203.4,133.44Z" transform="translate(-194.986 -133.44)" fill="#4e0000"/>
                        </g>
                      </g>
                      <g id="Group_24" data-name="Group 24" transform="translate(37.202 42.694)">
                        <g id="Group_23" data-name="Group 23">
                          <path id="Path_22" data-name="Path 22" d="M232.558,263.68a2.8,2.8,0,0,0-2.8,2.763,2.626,2.626,0,0,0,1.14,2.142v3.454c0,.023,0,.047,0,.07a1.624,1.624,0,0,0,1.658,1.588,1.658,1.658,0,0,0,1.658-1.658v-3.454a2.694,2.694,0,0,0,1.071-2.142c0-.012,0-.023,0-.035A2.729,2.729,0,0,0,232.558,263.68Z" transform="translate(-229.76 -263.68)" fill="#4e0000"/>
                        </g>
                      </g>
                      <g id="Group_26" data-name="Group 26">
                        <g id="Group_25" data-name="Group 25">
                          <path id="Path_23" data-name="Path 23" d="M40,0A40,40,0,1,0,80,40,40,40,0,0,0,40,0ZM55.371,55.544a6.218,6.218,0,0,1-6.218,6.218H30.846a6.218,6.218,0,0,1-6.218-6.218V40a6.218,6.218,0,0,1,3.627-5.665V30.017a11.744,11.744,0,1,1,23.454,0v4.318A6.218,6.218,0,0,1,55.371,40Z" fill="#4e0000"/>
                        </g>
                      </g>
                    </svg>
                  </div>
                  <div className="dashboard-info-text">
                    <h6>Total ETH Paid</h6>
                    <p>{userDividendsDistributed} Eth ($ {userDividendsDistributedUSD})</p>
                  </div>
                </div>
              </Col>
              <Col sm="4">
                <div className="dashboard-info-section text-center">
                  <div className="dashboard-info-image mb-4">
                    <svg id="LastPayout" xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
                      <path id="Path_14" data-name="Path 14" d="M40,0A40,40,0,1,0,80,40,40.118,40.118,0,0,0,40,0Zm0,36A14.173,14.173,0,0,1,54,50,13.793,13.793,0,0,1,44,63.2V68H36V63.2A14.172,14.172,0,0,1,26,50h8c0,8,12,8,12,0a6.152,6.152,0,0,0-6-6A14.173,14.173,0,0,1,26,30,13.793,13.793,0,0,1,36,16.8V12h8v4.8A14.172,14.172,0,0,1,54,30H46c0-8-12-8-12,0A6.152,6.152,0,0,0,40,36Z" fill="#4e0000"/>
                    </svg>
                  </div>
                  <div className="dashboard-info-text">
                    <h6>Pending Rewards</h6>
                    <p>{userDividendsDistributedAt}</p>
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col sm="4">
                <div style = {{height: "40px"}}onClick={connect}>
                  Connect
                </div>
              </Col>
              <Col sm="4">
              </Col>
              <Col sm="4">
              </Col>
            </Row>
            <h4 className="text-center">Total ETH Paid To SHARTAN Holders
              <br/>{totalDividendsDistributed} ETH
              <br/>(${totalDividendsDistributedUSD})
            </h4>
          </Modal.Body>
        </Modal>
				</>
		);
}

export default App;
