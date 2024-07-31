import React from 'react';
import Modal from 'react-modal';
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  XIcon,
  LinkedinShareButton,
  LinkedinIcon,
  EmailShareButton,
  EmailIcon,
} from 'react-share';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
};

const ShareModal = ({ isOpen, onRequestClose, url, title }) => (
  <Modal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    style={customStyles}
    contentLabel="Share Modal"
    ariaHideApp={false}
  >
    <h2>Share this page</h2>
    <div className="share-buttons">
      <FacebookShareButton url={url} quote={title} className="share-button">
        <FacebookIcon size={32} round />
      </FacebookShareButton>
      <TwitterShareButton url={url} title={title} className="share-button">
        <XIcon size={32} round />
      </TwitterShareButton>
      <LinkedinShareButton url={url} title={title} source={url} className="share-button">
        <LinkedinIcon size={32} round />
      </LinkedinShareButton>
      <EmailShareButton url={url} subject={title} body="Check out this site!" className="share-button">
        <EmailIcon size={32} round />
      </EmailShareButton>
    </div>
    <button onClick={onRequestClose} className="close-button">Close</button>
  </Modal>
);

export default ShareModal;
