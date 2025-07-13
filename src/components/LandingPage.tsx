import React from 'react'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
// Method 1: Import all images from index file
import { images } from '../assets'

const LandingPage: React.FC = () => {
  const navigate = useNavigate()

  const handleGetStarted = () => {
    navigate('/dashboard')
  }

  return (
    <div className="bg-background-light">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-primary font-semibold text-text-dark mb-6 leading-tight">
            Đến để xét nghiệm, ở lại vì sự thấu hiểu
          </h1>
          <p className="text-lg md:text-xl font-secondary text-text-dark mb-8 leading-relaxed max-w-3xl mx-auto">
            Với các gói xét nghiệm linh hoạt, kết quả rõ ràng và sự chăm sóc cá nhân hóa, 
            chúng tôi giúp bạn tự tin hơn về sức khỏe của mình.
          </p>
        </div>
      </section>

      {/* Featured Image Section */}
      <section className="px-4 mb-16">
        <div className="container mx-auto">
          <div className="bg-primary-light rounded-2xl h-96 flex items-center justify-center overflow-hidden">
            <img 
              src={images.hero} 
              alt="Clinic Environment" 
              className="w-full h-full object-cover rounded-2xl"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                if (nextElement) {
                  nextElement.style.display = 'flex';
                }
              }}
            />
            <p className="text-primary font-secondary text-lg hidden">
              [Hero Image - Clinic Environment]
            </p>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* STI Tests Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle hover:shadow-md transition-shadow">
              <div className="bg-accent-50 rounded-xl h-48 mb-6 flex items-center justify-center overflow-hidden">
                <img 
                  src={images.stiTests} 
                  alt="STI Tests" 
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                    if (nextElement) {
                      nextElement.style.display = 'flex';
                    }
                  }}
                />
                <p className="text-accent font-secondary hidden">[STI Tests Image]</p>
              </div>
              <h3 className="text-xl font-primary font-semibold text-text-dark mb-3">
                Xét nghiệm STIs
              </h3>
              <p className="font-secondary text-text-dark mb-4 leading-relaxed">
                Kiểm tra các bệnh lây truyền qua đường tình dục phổ biến một cách riêng tư và bảo mật.
              </p>
              <button className="flex items-center text-primary font-secondary font-semibold hover:text-primary-600 transition-colors">
                Xem các gói
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </button>
            </div>

            {/* Consultation Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle hover:shadow-md transition-shadow">
              <div className="bg-accent-50 rounded-xl h-48 mb-6 flex items-center justify-center overflow-hidden">
                <img 
                  src={images.consultation} 
                  alt="Consultation" 
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                    if (nextElement) {
                      nextElement.style.display = 'flex';
                    }
                  }}
                />
                <p className="text-accent font-secondary hidden">[Consultation Image]</p>
              </div>
              <h3 className="text-xl font-primary font-semibold text-text-dark mb-3">
                Tư vấn 1-1
              </h3>
              <p className="font-secondary text-text-dark mb-4 leading-relaxed">
                Trò chuyện với các chuyên gia sức khỏe của chúng tôi để được giải đáp thắc mắc.
              </p>
              <button className="flex items-center text-primary font-secondary font-semibold hover:text-primary-600 transition-colors">
                Tìm hiểu thêm
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </button>
            </div>

            {/* Cycle Tracker Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-subtle hover:shadow-md transition-shadow">
              <div className="bg-accent-50 rounded-xl h-48 mb-6 flex items-center justify-center overflow-hidden">
                <img 
                  src={images.cycle} 
                  alt="Cycle Tracker" 
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <h3 className="text-xl font-primary font-semibold text-text-dark mb-3">
                Theo dõi chu kỳ
              </h3>
              <p className="font-secondary text-text-dark mb-4 leading-relaxed">
                Công cụ giúp bạn theo dõi chu kỳ kinh nguyệt và nhận các nhắc nhở quan trọng.
              </p>
              <button className="flex items-center text-primary font-secondary font-semibold hover:text-primary-600 transition-colors">
                Khám phá
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-secondary">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="bg-primary-light rounded-2xl h-96 flex items-center justify-center overflow-hidden">
              <img 
                src={images.howItWorks} 
                alt="How It Works Process" 
                className="w-full h-full object-cover rounded-2xl"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                  if (nextElement) {
                    nextElement.style.display = 'flex';
                  }
                }}
              />
              <p className="text-primary font-secondary text-lg hidden">
                [How It Works Process Image]
              </p>
            </div>

            {/* Content */}
            <div>
              <h2 className="text-3xl md:text-4xl font-primary font-semibold text-text-dark mb-8">
                Quy trình đơn giản và kín đáo
              </h2>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary text-text-light rounded-full w-8 h-8 flex items-center justify-center font-primary font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h3 className="font-primary font-semibold text-text-dark mb-2">
                      Đặt lịch trực tuyến
                    </h3>
                    <p className="font-secondary text-text-dark leading-relaxed">
                      Chọn gói dịch vụ phù hợp và đặt lịch hẹn tại cơ sở của chúng tôi trong vài phút.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary text-text-light rounded-full w-8 h-8 flex items-center justify-center font-primary font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="font-primary font-semibold text-text-dark mb-2">
                      Lấy mẫu tại cơ sở
                    </h3>
                    <p className="font-secondary text-text-dark leading-relaxed">
                      Đến cơ sở của chúng tôi để được nhân viên y tế chuyên nghiệp lấy mẫu nhanh chóng.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary text-text-light rounded-full w-8 h-8 flex items-center justify-center font-primary font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h3 className="font-primary font-semibold text-text-dark mb-2">
                      Nhận kết quả bảo mật
                    </h3>
                    <p className="font-secondary text-text-dark leading-relaxed">
                      Xem kết quả an toàn trên tài khoản cá nhân của bạn sau 1-3 ngày làm việc.
                    </p>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleGetStarted}
                className="bg-primary text-text-light px-8 py-3 rounded-full font-secondary font-bold hover:bg-primary-600 transition-colors"
              >
                Bắt đầu ngay
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage