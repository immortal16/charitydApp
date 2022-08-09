import { useState, useEffect } from 'react';
import { ethers, utils } from "ethers";
import abi from "./contracts/Charity.json";

function App() {
  const [error, setError] = useState(null);

  const [isOwner, setIsOwner] = useState(false);
  const [ownerAddress, setOwnerAddress] = useState(null);

  const [contribution, setContribution] = useState(null);

  const [currentTarget, setcurrentTarget] = useState(0);

  const [totalDonations, setTotalDonations] = useState(0);
  const [totalMoneyRaised, setTotalMoneyRaised] = useState(0);
  const [currentDaysOfWar, setCurrentDaysOfWar] = useState(0);

  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const [currentCharityTitle, setCurrentCharityTitle] = useState('');
  const [currentCharityDescription, setCurrentCharityDescription] = useState('');

  const [inputValue, setInputValue] = useState({ organizationAddress: "", charityTitle: "", charityDescription: "", charityComment: "", donation: "", target: "" });

  const contractAddress = '0xcF3eC3bB0117C181142925d2D38A6cf57e725713';
  const contractABI = abi.abi;

  const handleInputChange = (event) => {
    setInputValue(prevFormData => ({ ...prevFormData, [event.target.name]: event.target.value }));
  }

  const checkIfWalletIsConnected = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        setIsWalletConnected(true);
        console.log("Account Connected: ", account);
      } else {
        setError("Please install a MetaMask wallet to use our bank.");
        console.log("No Metamask detected");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getOwnerHandler = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const charityContract = new ethers.Contract(contractAddress, contractABI, signer);

        let _owner = await charityContract.owner();
        setOwnerAddress(_owner);

        const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });

        if (_owner.toLowerCase() === account.toLowerCase()) {
          setIsOwner(true);
        }
      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getMoneyRaised = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const charityContract = new ethers.Contract(contractAddress, contractABI, signer);

        let moneyRaised = await charityContract.moneyRaised();
        setTotalMoneyRaised(ethers.utils.formatEther(moneyRaised).toString());
      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getDonates = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const charityContract = new ethers.Contract(contractAddress, contractABI, signer);

        let allDonates = await charityContract.totalDonations();
        setTotalDonations(allDonates.toString());
      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getDaysOfWar = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const charityContract = new ethers.Contract(contractAddress, contractABI, signer);

        let daysofWar = await charityContract.daysOfWar();
        setCurrentDaysOfWar(daysofWar.toString());
      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getCharityTitle = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const charityContract = new ethers.Contract(contractAddress, contractABI, signer);

        let charityTitle = await charityContract.charityTitle();
        setCurrentCharityTitle(utils.parseBytes32String(charityTitle).toString());
      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getCharityDescription = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const charityContract = new ethers.Contract(contractAddress, contractABI, signer);

        let charityDescription = await charityContract.charityDescription();
        setCurrentCharityDescription(utils.parseBytes32String(charityDescription).toString());
      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const donateMoneyHandler = async (event) => {
    try {
      event.preventDefault();
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const charityContract = new ethers.Contract(contractAddress, contractABI, signer);
        
        const txn = await charityContract.donate(utils.formatBytes32String(inputValue.charityComment), { value: ethers.utils.parseEther(inputValue.donation) });
        console.log("Donating money...");
        await txn.wait();
        console.log("Donating money...done", txn.hash);

        getMoneyRaised();
        getDonates();
      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const myContributionHandler = async (event) => {
    event.preventDefault();
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const charityContract = new ethers.Contract(contractAddress, contractABI, signer);

        let [ ret1, ret2 ] = await charityContract.myContribution();

        if (ethers.utils.formatEther(ret2) > 0) {
          setContribution(ret1.toString().concat(" You have donated ", ethers.utils.formatEther(ret2).toString(), " ETH."));
        } else {
          setContribution(ret1.toString());
        }
      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const setCharityNameHandler = async (event) => {
    event.preventDefault();
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const charityContract = new ethers.Contract(contractAddress, contractABI, signer);

        const txn = await charityContract.setNewCharity(utils.formatBytes32String(inputValue.charityTitle), utils.formatBytes32String(inputValue.charityDescription));
        console.log("Setting Charity Name...");
        await txn.wait();
        console.log("Charity Name Changed", txn.hash);

        getCharityTitle();
        getCharityDescription();
      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getCharityTarget = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const charityContract = new ethers.Contract(contractAddress, contractABI, signer);

        let charityTarget = await charityContract.target();
        setcurrentTarget(ethers.utils.formatEther(charityTarget).toString());
      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const setCharityTargetHandler = async (event) => {
    event.preventDefault();
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const charityContract = new ethers.Contract(contractAddress, contractABI, signer);

        const txn = await charityContract.setTarget(ethers.utils.parseEther(inputValue.targetValue));
        console.log("Setting Charity Target...");
        await txn.wait();
        console.log("Charity Target Changed", txn.hash);

        getCharityTarget();
      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const setSendDonationHandler = async (event) => {
    event.preventDefault();
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const charityContract = new ethers.Contract(contractAddress, contractABI, signer);

        const txn = await charityContract.sendToOrganization(ethers.utils.getAddress(inputValue.organizationAddress));
        console.log("Sending target donation to organiztion...");
        await txn.wait();
        console.log("Target donation sent.", txn.hash);

        setcurrentTarget(0);
        setTotalDonations(0);
        setTotalMoneyRaised(0);
        setCurrentCharityTitle('');
        setCurrentCharityDescription('');
      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();

    getDaysOfWar();
    getDonates();
    getCharityTarget();
    getMoneyRaised();

    getOwnerHandler();

    getCharityTitle();
    getCharityDescription()
  }, [isWalletConnected])

  return (
    <main className="main-container">

      <h2 className="headline">

        <div className="mt-5">{
            currentCharityTitle === "" && isOwner ?
            <p>Setup the charity project title.</p> :
            <p className="text-3xl font-bold">{currentCharityTitle}</p>
          }
        </div>

      </h2>

      <section className="customer-section px-10 pt-5 pb-10">{
        error && <p className="text-2xl text-red-700">{error}</p>
        }

        <div className="mt-5">{
            currentCharityDescription === "" && isOwner ?
            <p>Setup the charity project description.</p> :
            <p className="font-bold">{currentCharityDescription}</p>
          }
        </div>

        <div className="ce">
          <div>
            <div className="mt-5">
              <p><span className="font-bold">Money raised</span></p>
            </div>

            <div className="mt-5">
              <p>{totalMoneyRaised}<span className="font-bold"/> ETH</p>
            </div>
          </div>

          <div>
            <div className="mt-5">
              <p><span className="font-bold">Target</span></p>
            </div>

            <div className="mt-5">
              <p>{currentTarget}<span className="font-bold"/> ETH</p>
            </div>
          </div>

          <div>
            <div className="mt-5">
              <p><span className="font-bold">Donates</span></p>
            </div>

            <div className="mt-5">
              <p>{totalDonations}</p>
            </div>
          </div>

          <div>
            <div className="mt-5">
              <p><span className="font-bold">Days of War</span></p>
            </div>

            <div className="mt-5">
              <p>{currentDaysOfWar}</p>
            </div>
          </div>
          
        </div>

        <div className="mt-7 mb-9">
          <form className="form-style">
            <input
              type="text"
              className="input-style"
              onChange={handleInputChange}
              name="donation"
              placeholder="0.0000 ETH"
              value={inputValue.donation}
            />

            <input
              type="text"
              className="input-style-2"
              onChange={handleInputChange}
              name="charityComment"
              placeholder="Leave a comment"
              value={inputValue.charityComment}
            />

            <button
              className="btn-purple-2"
              onClick={donateMoneyHandler}>
              Donate Money In ETH
            </button>
          </form>
        </div>

        <div className="mt-5">
          <p><span className="font-bold">Owner Address: </span>{ownerAddress}</p>
        </div>

        <div class="flex space-x-4">
          <div className="mt-5">
            <button className="btn-connect" onClick={myContributionHandler}>
              {"My Contribution"}
            </button>
          </div>
          <span className="ret">{contribution}</span>
        </div>

        <div className="mt-5">
          <button className="btn-connect" onClick={checkIfWalletIsConnected}>
            {isWalletConnected ? "Wallet Connected 🔒" : "Connect Wallet 🔑"}
          </button>
        </div>

      </section>
      {
        isOwner && (
          <section className="bank-owner-section">
            <h2 className="text-xl border-b-2 border-indigo-500 px-10 py-4 font-bold">Charity Admin Panel</h2>
            <div className="p-10">
              <form className="form-style">
                <input
                  type="text"
                  className="input-style"
                  onChange={handleInputChange}
                  name="charityTitle"
                  placeholder="Enter a charity project title"
                  value={inputValue.charityTitle}
                />

                <input
                  type="text"
                  className="input-style-2"
                  onChange={handleInputChange}
                  name="charityDescription"
                  placeholder="Enter a charity project description"
                  value={inputValue.charityDescription}
                />

                <button
                  className="btn-grey-2"
                  onClick={setCharityNameHandler}>
                  Set New Charity
                </button>
              </form>

              <div class="space"></div>

              <form className="form-style">
                <input
                  type="text"
                  className="input-style"
                  onChange={handleInputChange}
                  name="targetValue"
                  placeholder="0.0000 ETH"
                  value={inputValue.targetValue}
                />

                <button
                  className="btn-grey-2"
                  onClick={setCharityTargetHandler}>
                  Set New Target
                </button>

              </form>

              <div class="space"></div>

              <form className="form-style">
              <input
                  type="text"
                  className="input-style"
                  onChange={handleInputChange}
                  name="organizationAddress"
                  placeholder="0x..."
                  value={inputValue.organizationAddress}
                />

                <button
                  className="btn-grey-2"
                  onClick={setSendDonationHandler}>
                  Send donations to organization
                </button>
              </form>
            </div>
          </section>
        )
      }
    </main>
  );
}
export default App;