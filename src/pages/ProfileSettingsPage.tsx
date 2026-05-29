import { useNavigate } from "react-router-dom";

function MenuItem({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <button
      type="button"
      className={`flex h-[58px] w-full items-center gap-3 rounded-[12px] px-4 text-left text-[16px] ${
        active ? "bg-[#efefef] text-[#1f1d27]" : "text-[#94919d]"
      }`}
    >
      <span className="text-[20px]">◌</span>
      <span>{label}</span>
    </button>
  );
}

export default function ProfileSettingsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-page text-ink">
      <header className="mx-auto flex w-full max-w-[1728px] items-center gap-6 px-12 pt-8">
        <button className="h-[86px] w-[96px] shrink-0 overflow-hidden rounded-3xl bg-[#ececec]" onClick={() => navigate("/")}>
          <img src="/images/logo-header.png" alt="Qwik logo" className="h-full w-full object-cover" />
        </button>

        <div className="flex flex-1 items-center gap-2.5">
          <div className="flex h-14 w-[360px] items-center gap-2 rounded-[10px] border-2 border-orange px-3.5 text-[16px] text-[#b6b3bd]">
            <span className="text-lg text-[#f5932b]">⌕</span>
            <span>I am looking for ...</span>
          </div>
          <div className="text-[16px] text-[#9c98a5]">◉ Nig.</div>
        </div>

        <div className="flex items-center gap-2.5">
          <button className="h-11 w-11 rounded-lg bg-[#ececec] text-[18px]" type="button">◠</button>
          <button className="h-11 w-11 rounded-lg bg-[#ececec] text-[18px]" type="button">⌖</button>
          <button className="h-11 w-11 rounded-lg bg-[#ececec] text-[18px]" type="button">✉</button>
          <img className="h-11 w-11 rounded-full object-cover ring-2 ring-[#1c1a24]" src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=80" alt="avatar" />
          <button className="h-14 rounded-[11px] bg-gradient-to-r from-amber to-orange px-5 text-[16px] text-white shadow-glow" onClick={() => navigate("/promote-ad")} type="button">
            Post a free ad
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1728px] px-12 pb-20 pt-8">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[310px_1fr]">
          <aside className="rounded-[20px] bg-white p-4">
            <div className="space-y-2">
              <MenuItem label="Profile" active />
              <MenuItem label="Ads" />
              <MenuItem label="Make money" />
              <MenuItem label="Notification" />
              <MenuItem label="Help" />
              <MenuItem label="About" />
              <MenuItem label="Log out" />
            </div>
          </aside>

          <section>
            <div className="rounded-[20px] bg-white p-6">
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img className="h-[84px] w-[84px] rounded-full object-cover" src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=120" alt="profile" />
                    <button className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-[#f2f2f5] text-[14px]" type="button">✎</button>
                  </div>
                  <div>
                    <h1 className="text-[42px] font-medium leading-tight">Sherry James</h1>
                    <p className="text-[20px] text-[#8c8996]">Imshuvo97@gmail.com</p>
                  </div>
                </div>
                <div className="flex gap-10 text-center">
                  <div>
                    <p className="text-[42px]">12</p>
                    <p className="text-[18px] text-[#8c8996]">Following</p>
                  </div>
                  <div>
                    <p className="text-[42px]">23</p>
                    <p className="text-[18px] text-[#8c8996]">Followers</p>
                  </div>
                  <div>
                    <p className="text-[42px]">17</p>
                    <p className="text-[18px] text-[#8c8996]">adverts</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 max-w-[520px]">
              <div className="mb-6 flex flex-nowrap gap-3 text-[20px] sm:text-[24px]">
                <button className="whitespace-nowrap text-[#9794a1]" type="button">Edit Profile</button>
                <button className="whitespace-nowrap font-medium" type="button">Company details</button>
                <button className="whitespace-nowrap text-[#9794a1]" type="button">Chat settings</button>
              </div>

              <label className="mb-2 block text-[16px] text-[#94919d]">Business Name</label>
              <input className="mb-5 h-12 w-full rounded-[10px] border border-[#dedde4] bg-transparent px-3 text-[17px] outline-none" placeholder="Enter your full name" />

              <label className="mb-2 block text-[16px] text-[#94919d]">Description</label>
              <textarea className="mb-5 h-[120px] w-full rounded-[10px] border border-[#dedde4] bg-transparent px-3 py-3 text-[17px] outline-none" placeholder="What does your company do?" />

              <button className="h-[50px] w-full rounded-[10px] bg-gradient-to-r from-amber to-orange text-[18px] text-white shadow-glow" type="button">
                Save
              </button>
            </div>
          </section>
        </div>
      </main>

      <footer className="grid grid-cols-1 gap-6 bg-deep px-[70px] py-[84px] text-[#b0afbc] md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr_1fr_1.8fr]">
        <div className="mt-2 text-[58px] leading-none text-[#ff9412]">qwik</div>
        <div>
          <h5 className="mb-3.5 text-[24px] font-medium text-[#efeff5]">About</h5>
          <button className="mb-2.5 block text-[16px] text-[#5f6071]" onClick={() => navigate("/signup")} type="button">About Qwik</button>
          <a className="mb-2.5 block text-[16px] text-[#5f6071]">Career</a>
          <a className="mb-2.5 block text-[16px] text-[#5f6071]">Terms</a>
        </div>
        <div>
          <h5 className="mb-3.5 text-[24px] font-medium text-[#efeff5]">Resources</h5>
          <a className="mb-2.5 block text-[16px] text-[#5f6071]">Blog</a>
          <a className="mb-2.5 block text-[16px] text-[#5f6071]">Instagram</a>
          <a className="mb-2.5 block text-[16px] text-[#5f6071]">Youtube</a>
          <a className="mb-2.5 block text-[16px] text-[#5f6071]">Twitter</a>
        </div>
        <div>
          <h5 className="mb-3.5 text-[24px] font-medium text-[#efeff5]">Support</h5>
          <a className="mb-2.5 block text-[16px] text-[#5f6071]">help@qwik.ng</a>
          <a className="mb-2.5 block text-[16px] text-[#5f6071]">FAQs</a>
        </div>
        <div>
          <h5 className="mb-3.5 text-[24px] font-medium text-[#efeff5]">Download</h5>
          <button className="mb-2.5 h-14 w-full rounded-[10px] bg-[#1a1b33] text-[16px] text-[#76798d]" type="button">App Store</button>
          <button className="h-14 w-full rounded-[10px] bg-[#1a1b33] text-[16px] text-[#76798d]" type="button">Play Store</button>
        </div>
        <div>
          <h5 className="mb-3.5 text-[24px] font-medium text-[#efeff5]">Stay up to date</h5>
          <p className="mb-2.5 text-[16px] leading-[1.38] text-[#5f6071]">Get news, offers, promotions & the best deals sent to your inbox.</p>
          <div className="mt-2 flex">
            <input className="h-[54px] flex-1 rounded-l-[10px] border border-r-0 border-[#ff9b00] bg-transparent px-3 text-[15px] text-[#b5b5c3] outline-none" placeholder="@email" />
            <button className="h-[54px] rounded-r-[10px] bg-gradient-to-r from-amber to-orange px-[18px] text-[15px] text-white shadow-glow" type="button">Subscribe</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

