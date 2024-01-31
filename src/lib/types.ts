export type OrgSummary = {
  total: number
  org_name: string
  spfRate: number
  spfPassCount: number
  dkimRate: number
  dkimPassCount: number
  count: number
}

export type SpfAndDkimRate = {
  date: string
  spfRate: number
  dkimRate: number
}

/**
 * none: DMARCチェックに合格したが、特別なアクションは行われない。
 * reject: メッセージが拒否されるべきであることを示す。
 * quarantine: メッセージが隔離されるべきであることを示す。
 */
type Disposition = 'none' | 'quarantine' | 'reject'
/**
 * pass: 検証に成功。
 * fail: 検証に失敗。
 * neutral: 検証が明確な結果を示さない。
 * none: 検証が行われなかった。
 * temperror（一時的なエラー）: DNS問題など、一時的な理由で検証が完了しなかった。
 * permerror（永続的なエラー）: 検証に必要な情報が不正または不足しているなど、恒久的な問題がある。
 */
export type Result = 'pass' | 'fail' | 'neutral' | 'none' | 'temperror' | 'permerror'

type AuthResultsDkim = {
  domain: string
  result: Result
  selector?: number | string
}

export type Record = {
  row: {
    source_ip: string
    count: number
    policy_evaluated: {
      disposition: Disposition
      dkim: Result
      spf: Result
      reason: {
        type: string
        comment: string
      }
    }
  }
  identifiers: {
    envelope_to?: string
    envelope_from?: string
    header_from: string
  }
  auth_results: {
    dkim?: AuthResultsDkim | AuthResultsDkim[]
    spf: {
      domain: string
      result: Result
      scope?: string
    }
  }
}

export type Report = {
  version?: string
  report_metadata: {
    org_name: string
    email: string
    extra_contact_info?: string
    report_id: string
    date_range: {
      begin: number
      end: number
    }
  }
  policy_published: {
    domain: string
    adkim: string
    aspf: string
    p: string
    sp: string
    pct: number
  }
  record: Record[]
}
