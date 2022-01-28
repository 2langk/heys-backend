import AskAggTest from './askAgg';
import AskCommentTest from './askComment';
import AskLikeTest from './askLike';

const AskControllerTest = () => {
  describe('#3-1 AskAgg Test', AskAggTest);
  describe('#3-2 AskComment Test', AskCommentTest);
  describe('#3-3 AskLike Test', AskLikeTest);
};

export default AskControllerTest;
