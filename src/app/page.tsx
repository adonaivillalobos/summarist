"use client";

/* eslint-disable @next/next/no-img-element */
import { AiFillFileText, AiFillBulb, AiFillAudio } from "react-icons/ai";
import { BsStarFill, BsStarHalf } from "react-icons/bs";
import { BiCrown } from "react-icons/bi";
import { RiLeafLine } from "react-icons/ri";
import { useAppDispatch } from "@/redux/hooks";
import { openModal } from "@/redux/modalSlice";
import ActiveHeadings from "@/components/ActiveHeadings";

const features = [
  {
    icon: <AiFillFileText />,
    title: "Read or listen",
    subtitle: "Save time by getting the core ideas from the best books.",
  },
  {
    icon: <AiFillBulb />,
    title: "Find your next read",
    subtitle: "Explore book lists and personalized recommendations.",
  },
  {
    icon: <AiFillAudio />,
    title: "Briefcasts",
    subtitle: "Gain valuable insights from briefcasts",
  },
];

const headingsFirst = [
  "Enhance your knowledge",
  "Achieve greater success",
  "Improve your health",
  "Develop better parenting skills",
  "Increase happiness",
  "Be the best version of yourself!",
];

const headingsSecond = [
  "Expand your learning",
  "Accomplish your goals",
  "Strengthen your vitality",
  "Become a better caregiver",
  "Improve your mood",
  "Maximize your abilities",
];

const statsFirst = [
  {
    number: "93%",
    body: (
      <>
        of Summarist members <b>significantly increase</b> reading frequency.
      </>
    ),
  },
  {
    number: "96%",
    body: (
      <>
        of Summarist members <b>establish better</b> habits.
      </>
    ),
  },
  {
    number: "90%",
    body: (
      <>
        have made <b>significant positive</b> change to their lives.
      </>
    ),
  },
];

const statsSecond = [
  {
    number: "91%",
    body: (
      <>
        of Summarist members <b>report feeling more productive</b> after
        incorporating the service into their daily routine.
      </>
    ),
  },
  {
    number: "94%",
    body: (
      <>
        of Summarist members have <b>noticed an improvement</b> in their
        overall comprehension and retention of information.
      </>
    ),
  },
  {
    number: "88%",
    body: (
      <>
        of Summarist members <b>feel more informed</b> about current events and
        industry trends since using the platform.
      </>
    ),
  },
];

const reviews = [
  {
    name: "Hanna M.",
    body: (
      <>
        This app has been a <b>game-changer</b> for me! It&apos;s saved me so
        much time and effort in reading and comprehending books. Highly
        recommend it to all book lovers.
      </>
    ),
  },
  {
    name: "David B.",
    body: (
      <>
        I love this app! It provides <b>concise and accurate summaries</b> of
        books in a way that is easy to understand. It&apos;s also very
        user-friendly and intuitive.
      </>
    ),
  },
  {
    name: "Nathan S.",
    body: (
      <>
        This app is a great way to get the main takeaways from a book without
        having to read the entire thing.{" "}
        <b>The summaries are well-written and informative.</b> Definitely worth
        downloading.
      </>
    ),
  },
  {
    name: "Ryan R.",
    body: (
      <>
        If you&apos;re a busy person who{" "}
        <b>loves reading but doesn&apos;t have the time</b> to read every book
        in full, this app is for you! The summaries are thorough and provide a
        great overview of the book&apos;s content.
      </>
    ),
  },
];

const footerBlocks = [
  {
    title: "Actions",
    links: [
      "Summarist Magazine",
      "Cancel Subscription",
      "Help",
      "Contact us",
    ],
  },
  {
    title: "Useful Links",
    links: ["Pricing", "Summarist Business", "Gift Cards", "Authors & Publishers"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Partners", "Code of Conduct"],
  },
  {
    title: "Other",
    links: ["Sitemap", "Legal Notice", "Terms of Service", "Privacy Policies"],
  },
];

export default function Home() {
  const dispatch = useAppDispatch();
  const openLogin = () => dispatch(openModal("login"));

  return (
    <>
      <nav className="nav">
        <div className="nav__wrapper">
          <figure className="nav__img--mask">
            <img className="nav__img" src="/assets/logo.png" alt="logo" />
          </figure>
          <ul className="nav__list--wrapper">
            <li className="nav__list nav__list--login" onClick={openLogin}>
              Login
            </li>
            <li className="nav__list nav__list--mobile">About</li>
            <li className="nav__list nav__list--mobile">Contact</li>
            <li className="nav__list nav__list--mobile">Help</li>
          </ul>
        </div>
      </nav>

      <section id="landing">
        <div className="container">
          <div className="row">
            <div className="landing__wrapper">
              <div className="landing__content">
                <div className="landing__content__title">
                  Gain more knowledge <br className="remove--tablet" />
                  in less time
                </div>
                <div className="landing__content__subtitle">
                  Great summaries for busy people,
                  <br className="remove--tablet" />
                  individuals who barely have time to read,
                  <br className="remove--tablet" />
                  and even people who don’t like to read.
                </div>
                <button className="btn home__cta--btn" onClick={openLogin}>
                  Login
                </button>
              </div>
              <figure className="landing__image--mask">
                <img src="/assets/landing.png" alt="landing" />
              </figure>
            </div>
          </div>
        </div>
      </section>

      <section id="features">
        <div className="container">
          <div className="row">
            <div className="section__title">Understand books in few minutes</div>
            <div className="features__wrapper">
              {features.map((feature) => (
                <div className="features" key={feature.title}>
                  <div className="features__icon">{feature.icon}</div>
                  <div className="features__title">{feature.title}</div>
                  <div className="features__sub--title">{feature.subtitle}</div>
                </div>
              ))}
            </div>

            <div className="statistics__wrapper">
              <div className="statistics__content--header">
                <ActiveHeadings headings={headingsFirst} />
              </div>
              <div className="statistics__content--details">
                {statsFirst.map((stat) => (
                  <div className="statistics__data" key={stat.number}>
                    <div className="statistics__data--number">{stat.number}</div>
                    <div className="statistics__data--title">{stat.body}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="statistics__wrapper">
              <div className="statistics__content--details statistics__content--details-second">
                {statsSecond.map((stat) => (
                  <div className="statistics__data" key={stat.number}>
                    <div className="statistics__data--number">{stat.number}</div>
                    <div className="statistics__data--title">{stat.body}</div>
                  </div>
                ))}
              </div>
              <div className="statistics__content--header statistics__content--header-second">
                <ActiveHeadings headings={headingsSecond} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="reviews">
        <div className="row">
          <div className="container">
            <div className="section__title">What our members say</div>
            <div className="reviews__wrapper">
              {reviews.map((review) => (
                <div className="review" key={review.name}>
                  <div className="review__header">
                    <div className="review__name">{review.name}</div>
                    <div className="review__stars">
                      <BsStarFill />
                    </div>
                  </div>
                  <div className="review__body">{review.body}</div>
                </div>
              ))}
            </div>
            <div className="reviews__btn--wrapper">
              <button className="btn home__cta--btn" onClick={openLogin}>
                Login
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="numbers">
        <div className="container">
          <div className="row">
            <div className="section__title">Start growing with Summarist now</div>
            <div className="numbers__wrapper">
              <div className="numbers">
                <div className="numbers__icon">
                  <BiCrown />
                </div>
                <div className="numbers__title">3 Million</div>
                <div className="numbers__sub--title">
                  Downloads on all platforms
                </div>
              </div>
              <div className="numbers">
                <div className="numbers__icon numbers__star--icon">
                  <BsStarFill />
                  <BsStarHalf />
                </div>
                <div className="numbers__title">4.5 Stars</div>
                <div className="numbers__sub--title">
                  Average ratings on iOS and Google Play
                </div>
              </div>
              <div className="numbers">
                <div className="numbers__icon">
                  <RiLeafLine />
                </div>
                <div className="numbers__title">97%</div>
                <div className="numbers__sub--title">
                  Of Summarist members create a better reading habit
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="footer">
        <div className="container">
          <div className="row">
            <div className="footer__top--wrapper">
              {footerBlocks.map((block) => (
                <div className="footer__block" key={block.title}>
                  <div className="footer__link--title">{block.title}</div>
                  <div>
                    {block.links.map((link) => (
                      <div className="footer__link--wrapper" key={link}>
                        <a className="footer__link">{link}</a>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="footer__copyright--wrapper">
              <div className="footer__copyright">
                Copyright &copy; 2023 Summarist.
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}